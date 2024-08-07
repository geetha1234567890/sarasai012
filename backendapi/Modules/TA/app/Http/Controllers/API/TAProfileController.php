<?php

namespace Modules\TA\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Models\AdminUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use Auth;

use Modules\TA\Services\API\TAProfileServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;
use Modules\TA\Http\Requests\UpdateTAProfileRequest;

class TAProfileController extends Controller
{
    private $ta_profile_services;
    private $api_response_helper;

    /**
     * Constructor for initializing ProfileController.
     *
     * @param TAProfileServices $ta_profile_services Injected service for profile operations.
     * @param APIResponseHelper $api_response_helper Injected helper for API response handling.
     */
    public function __construct(
        TAProfileServices $ta_profile_services,
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
        $this->ta_profile_services = $ta_profile_services;
        $this->api_response_helper = $api_response_helper;
    }

    /**
     * Retrieve the profile of the logged-in user.
     *
     * @return \Illuminate\Http\JsonResponse The API response containing the user profile data or an error message.
     */
    public function GetUser()
    {
        try {
            // Fetch the profile data of the logged-in user using the profile service
            $get_ta_profile = $this->ta_profile_services->GetLoginUserProfile();

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $get_ta_profile,
                $this->status_code,
                $this->not_found_status_code 
            );
        } catch (\Exception $e) {
            // Handle any exceptions that occur during the execution
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage(), // Optionally include the error message for debugging
            ],   $this->server_error,); // You can adjust the status code based on the type of error encountered
        }
    }

    /**
     * Update the profile of the logged-in user.
     *
     * @param UpdateTAProfileRequest $request The request object containing the profile update data.
     * @return \Illuminate\Http\JsonResponse The API response containing the update result or an error message.
     */
    public function update(UpdateTAProfileRequest $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validated();

            // Call the UpdateProfile method from the profile services to update the user profile
            $update_profile = $this->ta_profile_services->UpdateProfile($request);

            // Generate API response based on the result of the profile update
            return $this->api_response_helper::generateAPIResponse(
                $update_profile,
                $this->new_resource_create,
                $this->unprocessable_entity_status_code
            );
        } catch (\Exception $e) {
            // Handle any exceptions that occur during the execution
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage(), // Optionally include the error message for debugging
            ], $this->server_error); // Adjust the status code based on the type of error encountered
        }
    }
    
}
