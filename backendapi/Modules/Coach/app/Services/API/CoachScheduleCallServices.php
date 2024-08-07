<?php

namespace Modules\Coach\Services\API;

use Illuminate\Support\Facades\Hash;
use Auth;
use Crypt;

use Modules\Admin\Models\TACoachSlots;
use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\TACoachScheduling;
use Modules\Admin\Models\TACoachBatchScheduling;
use Modules\Admin\Models\TACoachStudentScheduling;
use Carbon\Carbon;
class CoachScheduleCallServices
{
    
        /**
         * Retrieve today's schedule call data.
         *
         * This method gets the current date and time, retrieves the authenticated admin user's ID,
         * and fetches the TA coach slots for today. It checks if any TA is available for the current
         * date and time, and returns the appropriate response.
         *
         * @return array An array containing the status, message, and data (if available).
         */
    public function getScheduleCallData($request)
    {
        // Get the current date in 'Y-m-d' format
        $current_date =$request->date;
        $current_time = Carbon::now()->format('H:i:s');
        $user_id = Auth::guard('admin-api')->user()->id;

        // Retrieve TA coach slots for the current date and time
        $coach_schedules = TACoachScheduling::with(['students'])
            ->where('admin_user_id', $user_id)
            ->where('is_deleted', false)
            ->where('date', $current_date)
            ->get()
            ->map(function ($item) use ($current_time) {
                // Remove unwanted fields
                unset($item->series);
                unset($item->is_deleted);
                unset($item->created_at);
                unset($item->updated_at);
                unset($item->created_by);
                unset($item->updated_by);

                if ($item->start_time <= $current_time && $item->end_time >= $current_time) {
                    $item->event_status = 'join meeting';
                } elseif ($item->end_time < $current_time) {
                    $item->event_status = 'call expired';
                } else {
                    $item->event_status = 'call schedule';
                }
                // Optionally, you can do the same for the students relationship
                $item->students->map(function ($student) {
                    unset($student->created_by);
                    unset($student->updated_by);
                    unset($student->created_at);
                    unset($student->updated_at);
                    return $student;
                });

                return $item;
            });

        // Convert the collection to an array
        $coach_schedules = $coach_schedules->toArray();


        if ($coach_schedules) {
            return [
                'status' => true,
                'message' => __('Admin::response_message.coach_schedule.coach_schedule_retrieve'),
                'data' => $coach_schedules,
            ];
        } else {
            return [
                'status' => false,
                'message' => __('Admin::response_message.coach_schedule.coach_schedule_found'),
            ];
        }
    }
    
}
