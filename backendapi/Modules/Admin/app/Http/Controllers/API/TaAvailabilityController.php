<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use Modules\Admin\Models\TACoachAvailability;
use Modules\Admin\Models\AdminUsers;
use Auth;


use Modules\Admin\Services\API\TaAvailabilityServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;

class TaAvailabilityController extends Controller
{

    private $ta_availability_services;
    private $api_response_helper;

    /**
     * Constructor method for initializing dependencies and status codes.
     *
     * @param \Modules\Admin\Services\API\TaAvailabilityServices $ta_availability_services
     * @param \Modules\Admin\Helpers\APIResponse\APIResponseHelper $api_response_helper
     */
    public function __construct(
        TaAvailabilityServices $ta_availability_services,
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
        $this->ta_availability_services = $ta_availability_services;
        $this->api_response_helper = $api_response_helper;
    }


    /**
     * Handle the request to get today's available (TA).
     *
     * @return \Illuminate\Http\JsonResponse The JSON response containing the available TA data or an error message.
     */
    public function index()
    {
        try {
            // Fetch the available (TA) for today using the TaAvailabilityServices
            $get_ta_available = $this->ta_availability_services->getTaAvailable();

            // Generate and return the API response using the response helper
            return $this->api_response_helper::generateAPIResponse(
                $get_ta_available,
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
     * Create a new Teaching Assistant (TA) availability record.
     *
     * This method creates a new TA availability record based on the provided data.
     *
     * @param \Illuminate\Http\Request $request
     *   The HTTP request object containing the new TA availability data.
     *
     * @return \Illuminate\Http\JsonResponse
     *   A JSON response indicating the outcome of the creation operation.
     *
     * @throws \Illuminate\Validation\ValidationException
     *   If the validation of the request data fails.
     * @throws \Exception
     *   If any unexpected error occurs during the operation.
     */

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'admin_user_id' => 'required|integer',
                'current_availability' => 'required|string|max:255',
                'calendar' => 'required|string|max:255',
                'is_active' => 'required|boolean',
                'created_by' => 'required|integer',
                'updated_by' => 'nullable|integer',
            ]);

            $response = $this->taAvailabilityServices->createTaAvailability($validatedData);

            return response()->json($response['message'], $response['status'] ? 201 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating TA availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Retrieve a specific Teaching Assistant (TA) availability record.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $response = $this->taAvailabilityServices->getTaAvailabilityById($id);

            return response()->json($response['data'] ?? [], $response['status'] ? 200 : 404);
            
        } catch (\Exception $e) {
            Log::error('Error retrieving TA availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Update a Teaching Assistant (TA) availability record.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'admin_user_id' => 'required|integer',
                'current_availability' => 'required|string|max:255',
                'calendar' => 'required|string|max:255',
                'is_active' => 'required|boolean',
                'created_by' => 'required|integer',
                'updated_by' => 'nullable|integer',
            ]);

            $response = $this->taAvailabilityServices->updateTaAvailability($id, $validatedData);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating TA availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Delete a Teaching Assistant (TA) availability record.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $response = $this->taAvailabilityServices->deleteTaAvailability($id);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Exception $e) {
            Log::error('Error deleting TA availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Change the availability status of a Teaching Assistant (TA).
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function changeAvailabilityStatus(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'current_availability' => 'required|string|max:255',
            ]);

            $response = $this->taAvailabilityServices->changeAvailabilityStatus($id, $validatedData['current_availability']);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error changing TA availability status:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
