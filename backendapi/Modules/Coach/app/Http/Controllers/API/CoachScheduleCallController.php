<?php

namespace Modules\Coach\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Models\TACoachSlots;
use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\TACoachScheduling;
use Modules\Admin\Models\TACoachBatchScheduling;
use Modules\Admin\Models\TACoachStudentScheduling;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Auth;


use Modules\Coach\Services\API\CoachScheduleCallServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;
class CoachScheduleCallController extends Controller
{

    private $coach_schedule_services;
    private $api_response_helper;

    /**
     * Constructor for initializing ProfileController.
     *
     * @param CoachScheduleCallServices $coach_calender_services Injected service for profile operations.
     * @param APIResponseHelper $api_response_helper Injected helper for API response handling.
     */
    public function __construct(
        CoachScheduleCallServices $coach_schedule_services,
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
        $this->coach_schedule_services = $coach_schedule_services;
        $this->api_response_helper = $api_response_helper;
    }

     /**
     * Get schedule call.
     *
     * This method retrieves the schedule for date from the coach calendar services
     * and generates an API response. If an exception occurs during the process,
     * an error response is returned.
     *
     * @return \Illuminate\Http\JsonResponse The API response containing today's schedule or an error message.
     */    
    public function getScheduleCall(Request $request)
    {

        try {

            // Retrieve today's schedule call data from the coach calendar services
            $schedules = $this->coach_schedule_services->getScheduleCallData($request);

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $schedules,
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

}
