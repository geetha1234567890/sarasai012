<?php
    namespace Modules\Coach\Services\API;

    use Illuminate\Support\Facades\Hash;
    use Auth;
    use Crypt;

    use Modules\Admin\Models\TACoachSlots;
    use Modules\Admin\Models\AdminUsers;
    use Modules\Admin\Models\TACoachScheduling;
    use Modules\Admin\Models\CallRequest;
    use Carbon\Carbon;

class CoachCallRequestServices
{
    public function getAllCallRequest()
    {
            // Get the ID of the currently authenticated coach
            $id = Auth::guard('admin-api')->user()->id;

            // Query the database for sessions associated with the coach
            $db_data = CallRequest::where('receiver_id', $id)
            ->where('status', '!=', 'Reject')
            ->get();
            
            // Convert the collection of sessions to an array
            $db_data = $db_data->toArray();

            // Check if sessions were found
            if ($db_data) {

                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_call_request.call_request_retrieve'),
                    'data' => $db_data,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_call_request.call_request_not_found'),
                ];
            }

    }

    public function approveCallRequest($id)
    {
            // Get the ID of the currently authenticated coach
            $coach_id = Auth::guard('admin-api')->user()->id;

            // Query the database for sessions associated with the coach
            $db_data = CallRequest::where('id', $id)
                ->where('receiver_id', $coach_id)
                ->first();
            if ($db_data) {
                    $db_data->update(['status' => 'Approved']);
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_call_request.call_request_approve'),
                    'data' => $db_data,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_call_request.call_request_not_found'),
                ];
            }

    }

    public function deniedCallRequest($request,$id)
    {
            // Get the ID of the currently authenticated coach

            $reject_reason=$request->reject_reason;
            
            $coach_id = Auth::guard('admin-api')->user()->id;

            // Query the database for sessions associated with the coach
            $db_data = CallRequest::where('id', $id)
                ->where('receiver_id', $coach_id)
                ->first();
              
            if ($db_data) {
                print_r($reject_reason);
                    $db_data->update([
                        'reject_reason'=>$reject_reason,
                        'status' => 'Reject',
                         
                    ]);
                    //     print_r($db_data);
                    // die;  
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.coach_call_request.call_request_reject'),
                    'data' => $db_data,
                ];
            } else {

                return [
                    'status' => false,
                    'message' => __('Admin::response_message.coach_call_request.call_request_not_found'),
                ];
            }

    }

}
