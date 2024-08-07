<?php

namespace Modules\TA\Http\Controllers\API;

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
use Modules\Admin\Http\Requests\StoreLeaveRequest;
use Auth;

use Modules\TA\Services\API\TACalenderServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;

class TACalenderController extends Controller
{

    private $ta_calender_services;
    private $api_response_helper;

    /**
     * Constructor for initializing ProfileController.
     *
     * @param TACalenderServices $ta_calender_services Injected service for profile operations.
     * @param APIResponseHelper $api_response_helper Injected helper for API response handling.
     */
    public function __construct(
        TACalenderServices $ta_calender_services,
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
        $this->ta_calender_services = $ta_calender_services;
        $this->api_response_helper = $api_response_helper;
    }

    /**
     * Retrieve all available slots.
     *
     * @return \Illuminate\Http\JsonResponse The API response containing the available slots or an error message.
     */
    public function getAllSlots()
    {

        try {
            // Fetch all available slots using the calendar service
            $get_slots = $this->ta_calender_services->getSlots();

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $get_slots,
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

    public function getAllSlotByDate(Request $request)
    {
        try {
            // Validate the incoming request data
            $rules = [
                'slot_date' => 'required|date',
            ];

            $validator = Validator::make($request->all(), $rules);
            
            // Fetch all available slots using the calendar service
            $get_slots = $this->ta_calender_services->getSlotsByDate($request);

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $get_slots,
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
     * Retrieve all available sessions.
     *
     * @return \Illuminate\Http\JsonResponse The API response containing the available sessions or an error message.
     */
    public function getAllSessions()
    {

        try {
            // Fetch all available session data using the calendar service
            $schedules = $this->ta_calender_services->getAllSessionsData();

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

    public function storeSlots(Request $request)
    {
        try {
            // Validate the incoming request data
            $rules = [
                'slot_date' => 'required|date',
                'from_time' => 'required|date_format:H:i:s',
                'to_time' => 'required|date_format:H:i:s|after:from_time',
                'timezone' => 'required|string',
                'series' => 'integer|nullable',
            ];

            $validator = Validator::make($request->all(), $rules);
            
            // Store slots using the service class method
            $store_slots = $this->ta_calender_services->storeSlots($request);

            // Generate API response based on the result of storing slots
            return $this->api_response_helper::generateAPIResponse(
                $store_slots,
                $this->new_resource_create,
                $this->unprocessable_entity_status_code 
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


    public function storeSchedules(Request $request)
    {
        try {
            // Validate the incoming request data

            $rules = [
                'meeting_name' => 'required|string',
                'meeting_url' => 'required|string',
                'schedule_date' => 'required|date',
                'slot_id' => 'required|integer',
                'start_time' => 'required|date_format:H:i:s',
                'end_time' => 'required|date_format:H:i:s|after:from_time',
                'timezone' => 'required|string',
                'event_status' => 'required|string',
                'studentId' => 'array', // studentId should be an array
                'studentId.*' => 'integer', // Each studentId in the array should be an integer
                'batchId' => 'array', // batchId should be an array
                'batchId.*' => 'integer', // Each batchId in the array should be an integer
            ];

            $validator = Validator::make($request->all(), $rules);
           
            
            // Store schedules using the service class method
           
            $store_schedule = $this->ta_calender_services->storeSchedules($request);

            // Generate API response based on the result of storing schedules
            return $this->api_response_helper::generateAPIResponse(
                $store_schedule,
                $this->new_resource_create,
                $this->unprocessable_entity_status_code 
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

    public function storeLeave(StoreLeaveRequest $request)
    {
        try {
            // Validate the incoming request data
            $validatedData = $request->validated();
            
            $store_leave = $this->ta_calender_services->storeLeave($request);

            // Generate API response based on the result of storing slots
            return $this->api_response_helper::generateAPIResponse(
                $store_leave,
                $this->new_resource_create,
                $this->unprocessable_entity_status_code 
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
