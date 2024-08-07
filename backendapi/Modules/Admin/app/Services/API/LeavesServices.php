<?php 
    namespace Modules\Admin\Services\API;

    use Modules\Admin\Models\Leaves;
    use Carbon\Carbon;

    class LeavesServices
    {

        /**
         * Store leave method to create a new leave record.
         *
         * @param \Illuminate\Http\Request $request The incoming request object containing admin_user_id, start_date, and end_date.
         * @return array Status of the operation (true/false), message, and data (leave record).
         */
        public function storeLeave($request)
        {
            // Extract request parameters
            $admin_user_id = $request->admin_user_id;
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

            // Check if leave record creation was successful
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

        /**
         * Retrieve leave details data including TA coach slots.
         *
         * This function fetches leave details from the database along with associated TA coach slots.
         * It converts the data to an array and checks if any leave details are available.
         * Based on the availability, it returns an appropriate response.
         *
         * @return array An array containing the status, message, and leave details data if available.
         */
        public function getLeaveDetailsData()
        {
            // Retrieve leave details data along with associated TA coach slots
            $get_leave = Leaves::with('taCoachSlots')->get();         
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

    }
?>