<?php     

    namespace Modules\TA\Services\API;

    use Illuminate\Support\Facades\Hash;
    use Auth;
    use Crypt;

    use Modules\Admin\Models\TACoachSlots;
    use Modules\Admin\Models\AdminUsers;
    use Modules\Admin\Models\TACoachScheduling;
    use Modules\Admin\Models\TACoachBatchScheduling;
    use Modules\Admin\Models\Student;
    use Modules\Admin\Models\Batch;
    use Modules\Admin\Models\StudentBatchMapping;
    use Modules\Admin\Models\TACoachStudentScheduling;
    use Modules\Admin\Models\Leaves;
    use Carbon\Carbon;

    class TACalenderServices
    {

        /**
         * Retrieve time slots associated with the currently authenticated TA.
         *
         * @return array The response containing the status, message, and data (if slots are found).
         */
        public function getSlots()
        {
            // Get the ID of the currently authenticated TA
            $id = Auth::guard('admin-api')->user()->id;

            // Query the database for time slots associated with the TA
            $slots = TACoachSlots::with(['taCoachScheduling','taCoachScheduling.students','taCoachScheduling.batch'])
            ->where('admin_user_id', $id)
            ->orderBy('slot_date')
            ->orderBy('from_time')
            ->get();

            // Convert the collection of slots to an array
            $slots = $slots->toArray();

            // Check if slots were found
            if ($slots) {

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_calendor.slots_retrieve'),
                    'data' => $slots,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_calendor.slots_not_found'),
                ];
            }

        }

        public function getSlotsByDate($request)
        {
            // Get the ID of the currently authenticated coach
            $id = Auth::guard('admin-api')->user()->id;

            // Extract the date from the request
            $date = $request->date;

            // Query the database for time slots associated with the coach
            $slots = TACoachSlots::with(['taCoachScheduling'])
            ->where('admin_user_id', $id)
            ->where('slot_date', $date)
            ->orderBy('from_time')
            ->get();

            // Convert the collection of slots to an array
            $slots = $slots->toArray();

            // Check if slots were found
            if ($slots) {

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_calendor.slots_retrieve'),
                    'data' => $slots,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_calendor.slots_not_found'),
                ];
            }

        }

        /**
         * Retrieve all sessions data associated with the currently authenticated TA.
         *
         *
         * @return array An array containing status, message, and sessions data.
         *               - status: boolean, indicating success or failure of the operation.
         *               - message: string, a message describing the outcome of the operation.
         *               - data: array, containing session information if successful.
         */
        public function getAllSessionsData()
        {
            // Get the ID of the currently authenticated TA
            $id = Auth::guard('admin-api')->user()->id;

            // Query the database for sessions associated with the TA
            $schedules = TACoachScheduling::with(['taCoachSlots','students','batch'])
            ->where('admin_user_id', $id)
            ->where('is_deleted', false)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();
            
            // Convert the collection of sessions to an array
            $schedules = $schedules->toArray();

            // Check if sessions were found
            if ($schedules) {

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_calendor.slots_session_retrieve'),
                    'data' => $schedules,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_calendor.slots_session_not_found'),
                ];
            }

        }


        public function storeSlots($request)
        {
            // Extract request parameters
            $adminUserId = Auth::guard('admin-api')->user()->id;
            $slotDate = Carbon::parse($request->slot_date);
            $fromTime = $request->from_time;
            $toTime = $request->to_time;
            $endDate = Carbon::parse($request->end_date);
            $weeks = $request->weeks ?? []; // array example: [1,0,0,1,0,1,0]
        
            // Validate slotDate against today's date
            if ($slotDate->isBefore(Carbon::today())) {
                return [
                    'status'=>false,
                    'message' => __('Admin::response_message.slots.slot_start_date'),
                ];
            }

            $potentialDates = [];
        
            // Calculate all dates within the range based on the weeks array
            for ($date = $slotDate; $date->lte($endDate); $date->addDay()) {
                $dayOfWeek = $date->dayOfWeek; // 0 (Sunday) to 6 (Saturday)
                if (isset($weeks[$dayOfWeek]) && $weeks[$dayOfWeek] == 1) {
                    $potentialDates[] = $date->format('Y-m-d');
                }
            }
        
            // Check for slot clashes on all potential dates
            foreach ($potentialDates as $date) {
                $existingSlots = TACoachSlots::where('admin_user_id', $adminUserId)
                                            ->where('slot_date', $date)
                                            ->orderBy('from_time')
                                            ->get();
        
                foreach ($existingSlots as $slot) {
                    if (($fromTime >= $slot->from_time && $fromTime < $slot->to_time) ||
                        ($toTime > $slot->from_time && $toTime <= $slot->to_time) ||
                        ($fromTime <= $slot->from_time && $toTime >= $slot->to_time)) {

                        return [
                            'status'=>false,
                            'message' => __('Admin::response_message.slots.slot_clash_message', ['date' => $date]),
                        ];

                    }
                }
            }
        
            // No clashes found, proceed to create slots
            $created_slots = [];
            $seriesId = null;
        
            foreach ($potentialDates as $date) {
                $newSlot = new TACoachSlots([
                    'admin_user_id' => $adminUserId,
                    'slot_date' => $date,
                    'from_time' => $fromTime,
                    'to_time' => $toTime,
                    'timezone' => $request->timezone,
                    'created_by' => $request->created_by,
                    'updated_by' => $request->updated_by,
                ]);
                
                $newSlot->save();
        
                // Assign series ID for grouping, ensuring null for the first slot and parent ID for subsequent slots
                if ($seriesId === null) {
                    // If $seriesId is null, set it to the ID of the first created slot
                    $seriesId = $newSlot->id;
                } else {
                    // For subsequent slots, assign the same $seriesId (parent ID)
                    $newSlot->series = $seriesId;
                    $newSlot->save();
                }
        
                $created_slots[] = $newSlot;
            }

            // Return appropriate response based on slot creation result
            if($created_slots){
                return [
                    'status'=>true,
                    'message' => __('Admin::response_message.slots.slot_store'),
                    'data'=>$created_slots,
                ];
            }else{
                return [
                    'status'=>false,
                    'message' => __('Admin::response_message.slots.store_slot_failed'),
                ];
            }

        }

        public function storeLeave($request)
        {
            // Extract request parameters

            $admin_user_id = Auth::guard('admin-api')->user()->id;
            $approve_status = $request->approve_status ?? 1;
            $leave_type = $request->leave_type ?? 'full';
            $message = $request->reason ?? null;
            $leave_data = $request->data;
            
            foreach($leave_data as $data){
                $start_date = Carbon::parse($data['date']);
                $end_date = Carbon::parse($data['date']);
                $start_time = $data['start_time'];
                $end_time = $data['end_time'];
                $slot_id = $data['slot_id'] ?? null;

                $leave = Leaves::create([
                    'admin_user_id'=>$admin_user_id,
                    'slot_id'=>$slot_id,
                    'start_date'=>$start_date,
                    'end_date'=>$end_date,
                    'start_time'=>$start_time,
                    'end_time'=>$end_time,
                    'approve_status'=>$approve_status,
                    'leave_type'=>$leave_type,
                    'message'=>$message
                ]);
            }

            if (isset($leave) && $leave) {
                return [
                    'status'=>true,
                    'message' => __('Admin::response_message.leave.leave_store'),
                    'data'=>$leave,
                ];
            }else{
                return [
                    'status'=>false,
                    'message' => __('Admin::response_message.leave.store_leave_failed'),
                ];
            }

        }

        public function getLeaveDetailsData()
        {
            // Retrieve leave details data along with associated TA coach slots
            $get_leave = Leaves::with('taCoachSlots')
            ->where('admin_user_id', Auth::guard('admin-api')->user()->id)
            ->get();         
            $get_leave = $get_leave->toArray();
            
            // Check if any leave details are available and return the appropriate response
            if ($get_leave) {
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.leave.leave_retrieve'),
                    'data' => $get_leave,
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.leave.leave_not_found'),
                ];
            }
        }

        public function storeSchedules($request)
        {
        // Extract request parameters
        $adminUserId = Auth::guard('admin-api')->user()->id;
        $meeting_name = $request->meeting_name;
        $meeting_url = $request->meeting_url;
        $start_date = Carbon::parse($request->schedule_date);
        $slot_id = $request->slot_id;
        $start_time = $request->start_time;
        $end_time = $request->end_time;
        $timezone = $request->timezone;
        $event_status = $request->event_status;
        $endDate = Carbon::parse($request->end_date);
        $studentIds = $request->studentId ?? []; 
        $batchIds = $request->batchId ?? [];
        $weeks = $request->weeks ?? []; // array example: [1,0,0,1,0,1,0]
    
        // Validate slotDate against today's date
        if ($start_date->isBefore(Carbon::today())) {
            return [
                'status'=>false,
                'message' => __('Admin::response_message.schedule.schedule_start_date'),
            ];
        }

        $potentialDates = [];
        // Calculate all dates within the range based on the weeks array
        for ($date = $start_date; $date->lte($endDate); $date->addDay()) {
            $dayOfWeek = $date->dayOfWeek; // 0 (Sunday) to 6 (Saturday)
            if (isset($weeks[$dayOfWeek]) && $weeks[$dayOfWeek] == 1) {
                $potentialDates[] = $date->format('Y-m-d');
            }
        }
    
        // Check for slot clashes on all potential dates
        foreach ($potentialDates as $date) {
            $existingSchedule = TACoachScheduling::where('admin_user_id', $adminUserId)
                                        ->where('date', $date)
                                        ->orderBy('start_time')
                                        ->where('is_deleted', false)
                                        ->get();
    
            foreach ($existingSchedule as $schedule) {
                if (($start_time >= $schedule->start_time && $start_time < $schedule->end_time) ||
                    ($end_time > $schedule->start_time && $end_time <= $schedule->end_time) ||
                    ($start_time <= $schedule->start_time && $end_time >= $schedule->end_time)) {

                    return [
                        'status'=>false,
                        'message' => __('Admin::response_message.schedule.schedule_clash_message', ['date' => $date]),
                    ];

                }
            }
        }
        $potentialSlots = [];
        foreach ($potentialDates as $date) {
            $existingSlots = TACoachSlots::where('admin_user_id', $adminUserId)
                                        ->where('slot_date', $date)
                                        ->orderBy('from_time')
                                        ->get();

            if ($existingSlots->isEmpty()) {
                return [
                    'status' => false,
                    'message' => ['not slot on ', ['date' => $date]],
                ];
            }
            $count = 0;
            foreach ($existingSlots as $slot) {
                if (($start_time >= $slot->from_time && $end_time <= $slot->to_time)) {
                    $potentialSlots[] = $slot;
                    $count = 1;
                }
            }
            if($count==0){
                return [
                    'status' => false,
                    'message' => ['time not within slot',[
                        'date' => $date,
                        'slot_from_time' => $start_time,
                        'slot_to_time' => $end_time
                    ]
                    ],
                ];
            }
        }

        $created_schedule = [];
        $seriesId = null;
        
        foreach ($potentialSlots as $slot) {

            $newSchedule = new TACoachScheduling([
                'admin_user_id' => $adminUserId,
                'meeting_name' => $meeting_name,
                'meeting_url' => $meeting_url,
                'date' => $slot['slot_date'],
                'slot_id' => $slot['id'],
                'start_time' => $start_time,
                'end_time' => $end_time,
                'time_zone' => $timezone,
                'event_status' => $event_status,
                'created_by' => null,
                'updated_by' => null
            ]);
            
            $newSchedule->save();
            // Assign series ID for grouping, ensuring null for the first slot and parent ID for subsequent schedules
            if ($seriesId === null) {
                // If $seriesId is null, set it to the ID of the first created slot
                $seriesId = $newSchedule->id;
            } else {
                // For subsequent schedules, assign the same $seriesId (parent ID)
                $newSchedule->series = $seriesId;
                $newSchedule->save();
            }

            foreach ($request->batchId as $batchData) {
                $Batch = Batch::find($batchData);
                $newSchedule->batch()->attach($Batch);
                $studentListData = StudentBatchMapping::where('batch_id',$batchData)->get();
                foreach ($studentListData as $studentData) {
                    $student = Student::find($studentData);
                    $newSchedule->students()->attach($student);
                }
            }

            foreach ($request->studentId as $studentData) {
                $student = Student::find($studentData);
                if (!$newSchedule->students->contains($student)) {
                    $newSchedule->students()->attach($student);
                }
            }

            $created_schedule[] = $newSchedule;
        }

        // Return appropriate response based on slot creation result
        if($created_schedule){
            return [
                'status'=>true,
                'message' => __('Admin::response_message.schedule.schedule_store'),
                'data'=>$created_schedule,
            ];
        }else{
            return [
                'status'=>false,
                'message' => __('Admin::response_message.schedule.store_schedule_failed'),
            ];
        }

    }

    }   
?>