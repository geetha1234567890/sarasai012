<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Services\API\AuthServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;
use Modules\Admin\Models\AdminUsers;

use Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    private $auth_services;
    private $api_response_helper;

    /**
     * Constructor method for initializing dependencies and status codes.
     *
     * @param \Modules\Admin\Services\API\AuthServices $auth_services
     * @param \Modules\Admin\Helpers\APIResponse\APIResponseHelper $api_response_helper
     */
    public function __construct(
        AuthServices $auth_services,
        APIResponseHelper $api_response_helper,
    ){
        // Initialize HTTP status codes for various responses
        $this->status_code = config('global_constant.STATUS_CODE.SUCCESS');
        $this->not_found_status_code = config('global_constant.STATUS_CODE.NOT_FOUND');
        $this->bad_request_status_code = config('global_constant.STATUS_CODE.BAD_REQUEST');
        $this->credentials_valid_status_code = config('global_constant.STATUS_CODE.CREDENTIALS_VALID');
        $this->no_content_status_code = config('global_constant.STATUS_CODE.NO_CONTENT');
        $this->unprocessable_entity_status_code =  config('global_constant.STATUS_CODE.UNPROCESSABLE_ENTITY');
        $this->new_resource_create =  config('global_constant.STATUS_CODE.NEW_RESOURCE_CREATE');
        $this->server_error = config('global_constant.STATUS_CODE.SERVER_ERROR');

        // Injected dependencies initialization
        $this->auth_services = $auth_services;
        $this->api_response_helper = $api_response_helper;
    }

    /**
     * Handle the login request for admin users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    // TODO: we also need to check role of user only admin can login to admin panel and can have access to /admin route
    // and only TA can login to TA panel and can have access to /ta route same for coach
    public function login(Request $request)
    {
        // Validate the login request
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Find the admin user by email
        $adminUser = AdminUsers::where('username', $request->username)->first();
   
        if (!$adminUser || !Hash::check($request->password, $adminUser->password)) {
            // Return unauthorized response if the credentials are incorrect
            return response()->json(['message' => 'Access denied. Invalid credentials'], $this->credentials_valid_status_code);
        }

        $Role  = $adminUser->roles;

        $ROLES = [
            'TA' => '2001',
            'Coach' => '1984',
            'admin' => '5150',
        ];

        // Create a new personal access token for the admin user
        $tokenResult = $adminUser->createToken('Personal Access Token');
        $token = $tokenResult->token;
        $token->save();

        if ($adminUser->profile_picture) {
            $adminUser->profile_picture = base64_encode($adminUser->profile_picture);
        }  

        $adminUserArray = $adminUser->toArray();
        unset($adminUserArray['roles']);

        // Return the admin user and token details in the response
        return response()->json([
            'admin_user' => $adminUserArray,
            'role' => $ROLES[$Role[0]->role_name],
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
        ],$this->status_code);
    
    }

     /**
     * Handle the logout request for admin users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Get the authenticated admin user
        $user = Auth::guard('admin-api')->user();
        
        // Check if the user is authenticated
        if ($user) {
            // Revoke the user's current token
            $token = $user->token();
            $token->revoke();

            // Return success message
            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        }

        // Return error message if the user is not found
        return response()->json([
            'message' => 'User not found',
        ], $this->not_found_status_code);
    }
}
