<?php 
    namespace Modules\Coach\Http\Requests;
    use Illuminate\Foundation\Http\FormRequest;

    class UpdateCoachProfileRequest extends FormRequest
    {
        public function authorize()
        {
            return true;
        }

        /**
         * Get the validation rules that apply to the request.
         */
        public function rules(): array
        {
            return [
                'name' => 'required|string',
                'phone' => 'required|string|max:20|unique:admin_users,phone',
                'password' => 'string',
                'location' => 'string|nullable',
                'address' => 'required|string|nullable',
                'pincode' => 'required|string|nullable',
                'time_zone' => 'required|string',
                'gender' => 'required|in:Male,Female,Other',
                'date_of_birth' => 'required|date',
                'highest_qualification' => 'nullable|string',
                'profile_picture' => 'nullable|string', // Expect base64 encoded string
                'profile' => 'nullable|string',
                'about_me' => 'nullable|string',
            ];

        } 
    
        public function messages()
        {
            return [
                'name.required' => __('Admin::validation_message.coach_profile.name_required'),
                'name.string' => __('Admin::validation_message.coach_profile.name_string'),
                'name.max' => __('Admin::validation_message.coach_profile.name_max'),
        
                'phone.required' => __('Admin::validation_message.coach_profile.phone_required'),
                'phone.string' => __('Admin::validation_message.coach_profile.phone_string'),
                'phone.max' => __('Admin::validation_message.coach_profile.phone_max'),
                'phone.unique' => __('Admin::validation_message.coach_profile.phone_unique'),
        
                'password.string' => __('Admin::validation_message.coach_profile.password_string'),
                'password.max' => __('Admin::validation_message.coach_profile.password_max'),
        
                'location.string' => __('Admin::validation_message.coach_profile.location_string'),
                'location.nullable' => __('Admin::validation_message.coach_profile.location_nullable'),
        
                'address.required' => __('Admin::validation_message.coach_profile.address_required'),
                'address.string' => __('Admin::validation_message.coach_profile.address_string'),
        
                'pincode.required' => __('Admin::validation_message.coach_profile.pincode_required'),
                'pincode.string' => __('Admin::validation_message.coach_profile.pincode_string'),
        
                'time_zone.required' => __('Admin::validation_message.coach_profile.time_zone_required'),
                'time_zone.string' => __('Admin::validation_message.coach_profile.time_zone_string'),
        
                'gender.required' => __('Admin::validation_message.coach_profile.gender_required'),
                'gender.in' => __('Admin::validation_message.coach_profile.gender_in'),
        
                'date_of_birth.required' => __('Admin::validation_message.coach_profile.date_of_birth_required'),
                'date_of_birth.date' => __('Admin::validation_message.coach_profile.date_of_birth_date'),
        
                'highest_qualification.string' => __('Admin::validation_message.coach_profile.highest_qualification_string'),
                'highest_qualification.max' => __('Admin::validation_message.coach_profile.highest_qualification_max'),
        
                'profile_picture.nullable' => __('Admin::validation_message.coach_profile.profile_picture_nullable'),
                'profile_picture.string' => __('Admin::validation_message.coach_profile.profile_picture_string'),
        
                'profile.nullable' => __('Admin::validation_message.coach_profile.profile_nullable'),
                'profile.string' => __('Admin::validation_message.coach_profile.profile_string'),
        
                'about_me.nullable' => __('Admin::validation_message.coach_profile.about_me_nullable'),
                'about_me.string' => __('Admin::validation_message.coach_profile.about_me_string'),
        
                'is_active.boolean' => __('Admin::validation_message.coach_profile.is_active_boolean'),
            ];
        }
    }   
?>