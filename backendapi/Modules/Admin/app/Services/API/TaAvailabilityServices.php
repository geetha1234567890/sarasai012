<?php 
    namespace Modules\Admin\Services\API;

    use Carbon\Carbon;
    use Modules\Admin\Models\AdminUsers;
    use Modules\Admin\Models\TACoachSlots;

    //TODO : Should be add check for Leave also in TA availability          

    class TaAvailabilityServices
    {

        /**
         * Get the (TA) availability for the current date.
         *
         * @return array The response containing status, message, and data if available.
         */
        public function getTaAvailable()
        {
            // Get the current date in 'Y-m-d' format
            $current_date = Carbon::now()->format('Y-m-d');
            $current_time = Carbon::now()->format('H:i:s');

            // Fetch admin users who have TA coach slots for the current date and have the 'TA' role
            $today_available_ta = AdminUsers::whereHas('roles', function($query) {
                $query->where('role_name', 'TA');
            })->with([
                'taCoachSlots' => function($query) use ($current_date, $current_time) {
                    $query->where('slot_date', $current_date)->where('from_time', '<=', $current_time)
                    ->where('to_time', '>=', $current_time);
                },
                'roles' => function($query) {
                    $query->where('role_name', 'TA');
                },'taCoachSlots.taCoachScheduling'
            ])->get()->makeHidden(['profile_picture', 'created_by', 'updated_by', 'created_at', 'updated_at']);

            // Convert the collection to an array
            $available_ta = $today_available_ta->toArray();

            // Modify the array to include availability status and remove ta_coach_slots and roles fields
            $final_ta_list = array_map(function($ta) {
                $ta['availability_status'] = !empty($ta['ta_coach_slots']) ? 'available' : 'In active';
                //unset($ta['ta_coach_slots'], $ta['roles'], $ta['created_by'], $ta['updated_by'], $ta['created_at'], $ta['updated_at']);
                return $ta;
            }, $available_ta);

            // Check if any TA is available for today and return the appropriate response
            if ($final_ta_list) {
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.available_ta.available_ta_retrieve'),
                    'data' => $final_ta_list,
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.available_ta.available_ta_not_found'),
                ];
            }
        }

        /**
     * Create a new Teaching Assistant (TA) availability record.
     *
     * @param array $data The data to create the TA availability record.
     * @return array The response containing status, message, and data if available.
     */
    public function createTaAvailability($data)
    {
        try {
            // Retrieve the admin user associated with the provided admin_user_id.
            $admin_user_id = $data['admin_user_id'] ?? null;
            $TA = AdminUsers::find($admin_user_id);
            $ta_id = $TA->id ?? null;

            // Retrieve the currently authenticated admin user or use the created_by value from the request.
            $admin_id = $data['created_by'] ?? null;
            $admin = AdminUsers::find($admin_id);
            $admin_id = $admin->id ?? null;

            // Check if both TA and admin users exist.
            if ($ta_id && $admin_id) {
                // Create the TA availability record.
                $ta = TACoachAvailability::create([
                    'admin_user_id' => $ta_id,
                    'current_availability' => $data['current_availability'],
                    'calendar' => $data['calendar'],
                    'is_active' => $data['is_active'],
                    'created_by' => $admin_id,
                    'updated_by' => $data['updated_by'],
                ]);

                // Return a success response.
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_availability.created_successfully'),
                    'data' => $ta,
                ];

            } else {
                // Return an error response if TA or admin user not found.
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.user_not_found'),
                ];
            }
           
        } catch (\Exception $e) {
            // Log any unexpected error and return an error response.
            Log::error('Error creating TA availability:', ['message' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => __('Admin::response_message.ta_availability.create_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Retrieve a specific Teaching Assistant (TA) availability record.
     *
     * @param int $id The ID of the TA availability record to retrieve.
     * @return array The response containing status, message, and data if available.
     */
    public function getTaAvailabilityById($id)
    {
        try {
            // Retrieve the TA availability record with related admin user, creator, and updater details.
            $ta_availability = TACoachAvailability::with(['adminUser', 'createdBy', 'updatedBy'])
                ->find($id);

            if ($ta_availability) {
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_availability.found'),
                    'data' => $ta_availability,
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.not_found'),
                ];
            }

        } catch (\Exception $e) {
            // Log any unexpected error and return an error response.
            Log::error('Error retrieving TA availability:', ['message' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => __('Admin::response_message.ta_availability.retrieve_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update a Teaching Assistant (TA) availability record.
     *
     * @param int $id The ID of the TA availability record to update.
     * @param array $data The data to update the TA availability record.
     * @return array The response containing status, message, and data if available.
     */
    public function updateTaAvailability($id, $data)
    {
        try {
            // Find the TA availability record by ID.
            $ta_availability = TACoachAvailability::find($id);

            if (!$ta_availability) {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.not_found'),
                ];
            }

            // Retrieve the admin user associated with the provided admin_user_id.
            $admin_user_id = $data['admin_user_id'] ?? null;
            $TA = AdminUsers::find($admin_user_id);
            $ta_id = $TA->id ?? null;

            // Retrieve the currently authenticated admin user or use the created_by value from the request.
            $admin_id = $data['created_by'] ?? null;
            $admin = AdminUsers::find($admin_id);
            $admin_id = $admin->id ?? null;

            // Check if both TA and admin users exist.
            if ($ta_id && $admin_id) {
                // Prepare data for updating the TA availability record.
                $update_data = [
                    'admin_user_id' => $ta_id,
                    'current_availability' => $data['current_availability'],
                    'calendar' => $data['calendar'],
                    'is_active' => $data['is_active'],
                    'created_by' => $admin_id,
                    'updated_by' => $data['updated_by'],
                ];

                // Update the TA availability record.
                $ta_availability->update($update_data);

                // Return a success response.
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_availability.updated_successfully'),
                    'data' => $ta_availability,
                ];

            } else {
                // Return an error response if TA or admin user not found.
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.user_not_found'),
                ];
            }

        } catch (\Exception $e) {
            // Log any unexpected error and return an error response.
            Log::error('Error updating TA availability:', ['message' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => __('Admin::response_message.ta_availability.update_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a Teaching Assistant (TA) availability record.
     *
     * @param int $id The ID of the TA availability record to delete.
     * @return array The response containing status, message, and data if available.
     */
    public function deleteTaAvailability($id)
    {
        try {
            // Find the TA availability record by ID.
            $ta_availability = TACoachAvailability::find($id);

            if (!$ta_availability) {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.not_found'),
                ];
            }

            // Delete the TA availability record.
            $ta_availability->delete();

            // Return a success response.
            return [
                'status' => true,
                'message' => __('Admin::response_message.ta_availability.deleted_successfully'),
            ];

        } catch (\Exception $e) {
            // Log any unexpected error and return an error response.
            Log::error('Error deleting TA availability:', ['message' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => __('Admin::response_message.ta_availability.delete_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Change the availability status of a Teaching Assistant (TA).
     *
     * @param int $id The ID of the TA availability record to update.
     * @param string $availability_status The availability status to update.
     * @return array The response containing status, message, and data if available.
     */
    public function changeAvailabilityStatus($id, $availability_status)
    {
        try {
            // Find the TA availability record by ID.
            $ta_availability = TACoachAvailability::find($id);

            if (!$ta_availability) {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_availability.not_found'),
                ];
            }

            // Update the TA availability status.
            $ta_availability->current_availability = $availability_status;
            $ta_availability->save();

            // Return a success response.
            return [
                'status' => true,
                'message' => __('Admin::response_message.ta_availability.availability_updated'),
                'data' => $ta_availability,
            ];

        } catch (\Exception $e) {
            // Log any unexpected error and return an error response.
            Log::error('Error changing TA availability status:', ['message' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => __('Admin::response_message.ta_availability.availability_update_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    }
?>