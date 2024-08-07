<?php
namespace Modules\Coach\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Modules\Coach\Services\API\ProfileServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;
use Modules\Coach\Http\Requests\UpdateCoachProfileRequest;

use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;

class CoachesProfileController extends Controller
{

    private $profile_services;
    private $api_response_helper;

    /**
     * Constructor for initializing ProfileController.
     *
     * @param ProfileServices $profile_services Injected service for profile operations.
     * @param APIResponseHelper $api_response_helper Injected helper for API response handling.
     */
    public function __construct(
        ProfileServices $profile_services,
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
        $this->profile_services = $profile_services;
        $this->api_response_helper = $api_response_helper;
    }

    /**
     * Retrieve the logged-in user's profile information and generate an API response.
     *
     * @return \Illuminate\Http\JsonResponse API response containing user profile data or error message.
     */
    public function GetUser()
    {
        try {
            // Call the profile services to fetch the logged-in user's profile
            $get_ta_profile = $this->profile_services->GetLoginUserProfile();

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
     * Update the profile of the coach using the provided request data.
     *
     * @param \App\Http\Requests\UpdateCoachProfileRequest $request The request object containing validated profile data.
     * @return \Illuminate\Http\JsonResponse The response indicating the success or failure of the profile update.
     */
    public function update(UpdateCoachProfileRequest $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validated();

            // Call the UpdateProfile method from the profile services
            $update_profile = $this->profile_services->UpdateProfile($request);

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

