<?php 
    namespace Modules\TA\Services\API;

    use Modules\Admin\Models\AdminUsers;
    use Illuminate\Support\Facades\Hash;
    use Auth;
    use Crypt;

    class TAProfileServices 
    {   
        /**
         * Retrieve the profile of the logged-in user.
         *
         * @return array The response containing the status, message, and profile data.
         */
        public function GetLoginUserProfile()
        {
            // Get the currently authenticated user
            $ta = Auth::guard('admin-api')->user();

            // Extract specific fields from the coach model
            $data = $ta->only([
                'id', 
                'name', 
                'username', 
                'location', 
                'address', 
                'pincode', 
                'time_zone', 
                'gender',
                'date_of_birth', 
                'highest_qualification', 
                'profile', 
                'about_me', 
                'is_active', 
                'created_by', 
                'updated_by', 
                'created_at', 
                'updated_at'
            ]);
    
            try {
                // Decrypt email field if encrypted
                $data['email'] = Crypt::decrypt($ta->email);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                // Handle decryption failure
                $data['email'] = 'Decryption failed'; // or handle as per your application's logic
            }
    
            try {
                // Decrypt phone number field if encrypted
                $data['phone'] = Crypt::decrypt($ta->phone);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                // Handle decryption failure
                $data['phone'] = 'Decryption failed'; // or handle as per your application's logic
            }
    
            // Encode profile picture to base64 if exists
            $data['profile_picture'] = $ta->profile_picture ? base64_encode($ta->profile_picture) : null;
            
            // Return response based on whether data was retrieved successfully
            if ($data) {
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_profile.profile'),
                    'data' => $data,
                ];
            } else {
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_profile.profile_not_found'),
                ];
            }

        }

        /**
         * Update the profile of the logged-in user.
         *
         * @param \Illuminate\Http\Request $request The request object containing the profile update data.
         * @return array The response containing the status, message, and updated profile data.
         */
        public function UpdateProfile($request)
        {
            // Prepare an array of user data from the request, excluding username and email
            $user_data = [
                'name' => $request->name,
                'location' => $request->location,
                'address' => $request->address,
                'email' => $request->email,
                'username' => $request->username,
                'pincode' => $request->pincode,
                'time_zone' => $request->time_zone,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'highest_qualification' => $request->highest_qualification,
                'profile' => $request->profile,
                'about_me' => $request->about_me
            ];

            $user_data = $request->except(['email','username']);

            // If a password is provided, hash it and include it in the user data
            if (isset($request->password)) {
                $user_data['password'] = Hash::make($request->password);
            }

            // Convert base64-encoded profile picture to binary if present
            if ($request->has('profile_picture')) {
                $user_data['profile_picture'] = base64_decode($request->profile_picture);
            }

            // Encrypt the phone number if provided
            if (isset($request->phone)) {
                $user_data['phone'] = Crypt::encrypt($request->phone);
            }

            // Get the currently authenticated user from the 'admin-api' guard
            $coach = Auth::guard('admin-api')->user();
            $coach_id = $coach->id;

            // Find the user in the AdminUsers model
            $coach_user = AdminUsers::find($coach_id);

            if ($coach_user) {
                // Update the user's profile with the new data
                $coach_user->update($user_data);

                if ($coach_user->profile_picture) {
                    $coach_user->profile_picture = base64_encode($coach_user->profile_picture);
                }  

                // Return a success response with the updated user data
                return [
                    'status' => true,
                    'message' => __('Admin::response_message.ta_profile.profile_update'),
                    'data' => $coach_user,
                ];
            } else {
                // Return an error response if the user is not found
                return [
                    'status' => false,
                    'message' => __('Admin::response_message.ta_profile.profile_update_not_found'),
                ];
            }
        }

    }
?>