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

use Modules\Admin\Services\API\CoachAvailabilityServices;
use Modules\Admin\Helpers\APIResponse\APIResponseHelper;

class CoachAvailabilityController extends Controller
{
    private $coach_availability_services;
    private $api_response_helper;

    /**
     * Constructor method for initializing dependencies and status codes.
     *
     * @param \Modules\Admin\Services\API\CoachAvailabilityServices $coach_availability_services
     * @param \Modules\Admin\Helpers\APIResponse\APIResponseHelper $api_response_helper
     */
    public function __construct(
        CoachAvailabilityServices $coach_availability_services,
        APIResponseHelper $api_response_helper
    ){
        $this->status_code = config('global_constant.STATUS_CODE.SUCCESS');
        $this->not_found_status_code = config('global_constant.STATUS_CODE.NOT_FOUND');
        $this->server_error = config('global_constant.STATUS_CODE.SERVER_ERROR');

        $this->coach_availability_services = $coach_availability_services;
        $this->api_response_helper = $api_response_helper;
    }

    /**
     * Handle the request to get today's available Coaches.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $get_coach_available = $this->coach_availability_services->getCoachAvailable();

            return $this->api_response_helper::generateAPIResponse(
                $get_coach_available,
                $this->status_code,
                $this->not_found_status_code 
            );
        } catch (\Exception $e) {
            Log::error('Error retrieving Coach availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], $this->server_error);
        }
    }

    /**
     * Create a new Coach availability record.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
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

            $response = $this->coach_availability_services->createCoachAvailability($validatedData);

            return response()->json($response['message'], $response['status'] ? 201 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating Coach availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Retrieve a specific Coach availability record.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $response = $this->coach_availability_services->getCoachAvailabilityById($id);

            return response()->json($response['data'] ?? [], $response['status'] ? 200 : 404);
            
        } catch (\Exception $e) {
            Log::error('Error retrieving Coach availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Update a Coach availability record.
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

            $response = $this->coach_availability_services->updateCoachAvailability($id, $validatedData);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating Coach availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Delete a Coach availability record.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $response = $this->coach_availability_services->deleteCoachAvailability($id);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Exception $e) {
            Log::error('Error deleting Coach availability:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    /**
     * Change the availability status of a Coach.
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

            $response = $this->coach_availability_services->changeAvailabilityStatus($id, $validatedData['current_availability']);

            return response()->json($response['message'], $response['status'] ? 200 : 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error changing Coach availability status:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
