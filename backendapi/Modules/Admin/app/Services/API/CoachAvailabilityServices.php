<?php

namespace Modules\Admin\Services\API;

use Carbon\Carbon;
use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\TACoachAvailability;
use Modules\Admin\Models\TACoachSlots;

class CoachAvailabilityServices
{
    /**
     * Get the available Coaches for the current date.
     *
     * @return array The response containing status, message, and data if available.
     */
    public function getCoachAvailable()
    {
        $current_date = Carbon::now()->format('Y-m-d');
        $current_time = Carbon::now()->format('H:i:s');
        // $current_time = '12:00:00';

        $today_available_coaches = AdminUsers::whereHas('roles', function($query) {
            $query->where('role_name', 'Coach');
        })->with([
            'taCoachSlots' => function($query) use ($current_date, $current_time) {
                $query->where('slot_date', $current_date)->where('from_time', '<=', $current_time)
                ->where('to_time', '>=', $current_time);
            },
            'roles' => function($query) {
                $query->where('role_name', 'Coach');
            },'taCoachSlots.taCoachScheduling'
        ])->get()->makeHidden(['profile_picture', 'created_by', 'updated_by', 'created_at', 'updated_at']);
            
        $available_coaches = $today_available_coaches->toArray();

        $final_coach_list = array_map(function($coach) {
            $coach['availability_status'] = !empty($coach['ta_coach_slots']) ? 'available' : 'In active';
            // unset($coach['coach_availabilities'], $coach['roles'], $coach['created_by'], $coach['updated_by'], $coach['created_at'], $coach['updated_at']);
            return $coach;
        }, $available_coaches);

        if ($final_coach_list) {
            return [
                'status' => true,
                'message' => __('Admin::response_message.available_coaches.available_coaches_retrieve'),
                'data' => $final_coach_list,
            ];
        } else {
            return [
                'status' => false,
                'message' => __('Admin::response_message.available_coaches.available_coaches_not_found'),
            ];
        }
    }

    /**
     * Create a new Coach availability record.
     *
     * @param array $data The data to create the Coach availability record.
     * @return array The response containing status, message, and data if available.
     */
    public function createCoachAvailability($data)
    {
        try {
            $admin_user_id = $data['admin_user_id'] ?? null;
            $coach = AdminUsers::find($admin_user_id);
            $coach_id = $coach->id ?? null;

            $admin_id = $data['created_by'] ?? null;
            $admin = AdminUsers::find($admin_id);
            $admin_id = $admin->id ?? null;

            if ($coach_id && $admin_id) {
                $coach_availability = TACoachAvailability::create([
                    'admin_user_id' => $coach_id,
                    'current_availability' => $data['current_availability'],
                    'calendar' => $data['calendar'],
                    'is_active' => $data['is_active'],
                    'created_by' => $admin_id,
                    'updated_by' => $data['updated_by'] ?? null,
                ]);

                if ($coach_availability) {
                    return [
                        'status' => true,
                        'message' => __('Admin::response_message.coach_availabilities.availability_created'),
                    ];
                } else {
                    return [
                        'status' => false,
                        'message' => __('Admin::response_message.coach_availabilities.availability_not_created'),
                    ];
                }
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_availabilities.coach_id_and_admin_id_not_found'),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get a specific Coach availability record by ID.
     *
     * @param int $id The Coach availability ID to retrieve.
     * @return array The response containing status, message, and data if available.
     */
    public function getCoachAvailabilityById($id)
    {
        $coach_availability = TACoachAvailability::find($id);

        if ($coach_availability) {
            return [
                'status' => true,
                'message' => __('Admin::response_message.coach_availabilities.availability_retrieve_by_id'),
                'data' => $coach_availability,
            ];
        } else {
            return [
                'status' => false,
                'message' => __('Admin::response_message.coach_availabilities.availability_not_found'),
            ];
        }
    }

    /**
     * Update a Coach availability record.
     *
     * @param int $id The Coach availability ID to update.
     * @param array $data The data to update the Coach availability record.
     * @return array The response containing status and message.
     */
    public function updateCoachAvailability($id, $data)
    {
        try {
            $coach_availability = TACoachAvailability::find($id);

            if ($coach_availability) {
                $admin_id = $data['updated_by'] ?? null;
                $admin = AdminUsers::find($admin_id);
                $admin_id = $admin->id ?? null;

                if ($admin_id) {
                    $coach_availability->update([
                        'admin_user_id' => $data['admin_user_id'],
                        'current_availability' => $data['current_availability'],
                        'calendar' => $data['calendar'],
                        'is_active' => $data['is_active'],
                        'created_by' => $admin_id,
                    ]);

                    return [
                        'status' => true,
                        'message' => __('Admin::response_message.coach_availabilities.availability_updated'),
                    ];
                } else {
                    return [
                        'status' => false,
                        'message' => __('Admin::response_message.coach_availabilities.updated_by_id_not_found'),
                    ];
                }
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_availabilities.availability_not_found'),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a Coach availability record.
     *
     * @param int $id The Coach availability ID to delete.
     * @return array The response containing status and message.
     */
    public function deleteCoachAvailability($id)
    {
        try {
            $coach_availability = TACoachAvailability::find($id);

            if ($coach_availability) {
                $coach_availability->delete();

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_availabilities.availability_deleted'),
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_availabilities.availability_not_found'),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Change the availability status of a Coach.
     *
     * @param int $id The Coach availability ID to update.
     * @param string $current_availability The current availability status to update.
     * @return array The response containing status and message.
     */
    public function changeAvailabilityStatus($id, $current_availability)
    {
        try {
            $coach_availability = TACoachAvailability::find($id);

            if ($coach_availability) {
                $coach_availability->update([
                    'current_availability' => $current_availability,
                ]);

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_availabilities.availability_status_changed'),
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_availabilities.availability_not_found'),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}
