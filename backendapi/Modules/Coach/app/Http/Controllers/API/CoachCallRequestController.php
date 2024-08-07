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


use Modules\Coach\Services\API\CoachCallRequestServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;

class CoachCallRequestController extends Controller
{
    
    private $coach_call_request_services;
    private $api_response_helper;

    /**
     * Constructor for initializing ProfileController.
     *
     * @param CoachCallRequestServices $coach_calender_services Injected service for profile operations.
     * @param APIResponseHelper $api_response_helper Injected helper for API response handling.
     */
    public function __construct(
        CoachCallRequestServices $coach_call_request_services,
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
        $this->coach_call_request_services = $coach_call_request_services;
        $this->api_response_helper = $api_response_helper;
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        //
    }

    /**
     * Retrieve all call request associated with the currently authenticated coach.
     *
     * @return \Illuminate\Http\JsonResponse JSON response containing status, message,
     *                                       and data of sessions.
     */
    public function getAllCallRequest()
    {

        try {
            // Retrieve sessions using the coach_calendar_services instance
            $all_call_request = $this->coach_call_request_services->getAllCallRequest();

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $all_call_request,
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
     * Approved call request associated with the currently authenticated coach.
     *
     * @return \Illuminate\Http\JsonResponse JSON response containing status, message,
     *                                       and data of sessions.
     */
    public function approveCallRequest($id)
    {

        try {
            // Retrieve sessions using the coach_calendar_services instance
            $approve_call_request = $this->coach_call_request_services->approveCallRequest($id);

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $approve_call_request,
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
     * denied call request associated with the currently authenticated coach.
     *
     * @return \Illuminate\Http\JsonResponse JSON response containing status, message,
     *                                       and data of sessions.
     */
    public function deniedCallRequest(Request $request,$id)
    {
        try {
            // Retrieve sessions using the coach_calendar_services instance
            $denied_call_request = $this->coach_call_request_services->deniedCallRequest($request,$id);

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $denied_call_request,
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
