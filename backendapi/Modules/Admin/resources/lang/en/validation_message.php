<?php 
    return [
        'admin_id_required'=>'The admin user ID is required.',
        'admin_id_integer'=>'The admin user ID must be an integer.',
        'timezone_required' => 'The timezone is required.',
        'timezone_string' => 'The timezone must be a string.',
        'slots' =>[
            'slot_date_required' => 'The slot date is required.',
            'slot_date_valid' => 'The slot date must be a valid date.',
            'from_time_required' => 'The from time is required.',
            'from_time_date_format' => 'The from time must be in the format H:i:s (e.g., 12:30:00).',
            'to_time_required' => 'The to time is required.',
            'to_time_date_format' => 'The to time must be in the format H:i:s (e.g., 13:30:00).',
            'to_time_after' => 'The to time must be after the from time.',
            'series_integer'=>'The series must be an integer.',
        ],

        'meeting_name' => [
            'required' => 'The meeting name is required.',
            'string' => 'The meeting name must be a string.',
        ],

        'meeting_url' => [
            'required' => 'The meeting URL is required.',
            'string' => 'The meeting URL must be a string.',
        ],

        'schedule_date' => [
            'required' => 'The date is required.',
            'date' => 'The date must be a valid date.',
        ],

        'slotid' => [
            'required' => 'The slot ID is required.',
            'integer' => 'The slot ID must be an integer.',
        ],

        'start_time' => [
            'required' => 'The start time is required.',
            'date_format' => 'The start time must be in the format H:i:s (e.g., 12:30:00).',
        ],
    
        'end_time' => [
            'required' => 'The end time is required.',
            'date_format' => 'The end time must be in the format H:i:s (e.g., 13:30:00).',
            'after' => 'The end time must be after the start time.',
        ],
        'event_status' => [
            'required' => 'The event status is required.',
            'string' => 'The event status must be a string.',
        ],
        'studentId' => [
            'required' => 'The student ID field is required.',
            'array' => 'The student ID must be an array.',
            'integer' => 'Each student ID must be an integer.',
        ],
        'batchId' => [
            'required' => 'The batch IDs are required.',
            'array' => 'The batch IDs must be provided as an array.',
            'integer' => 'Each batch ID must be an integer.',
        ],
        'leave'=>[
            'start_date_required' => 'The start date field is required.',
            'start_date_date' => 'The start date must be a valid date format.',
            'end_date_required' => 'The end date field is required.',
            'end_date_date' => 'The end date must be a valid date format.',
            'end_date_after' => 'The end date must be later than the start date.',
        ],
        'ta_schedule'=>[
            'data_required' => 'The data field is required.',
            'data_array' => 'The data field must be an array.',
            'data_slot_id_required' => 'The slot ID is required for each entry.',
            'data_slot_id_integer' => 'The slot ID must be an integer for each entry.',
            'data_date_required' => 'The date is required for each entry.',
            'data_date_format' => 'The date must be a valid date for each entry.',
            'data_start_time_required' => 'The start time is required for each entry.',
            'data_start_time_date_format' => 'The start time format must be HH:MM:SS for each entry.',
            'data_end_time_required' => 'The end time is required for each entry.',
            'data_end_time_date_format' => 'The end time format must be HH:MM:SS for each entry.',
            'data_end_time_after' => 'The end time must be after the start time for each entry.',
        ],
        'coaching_template'=>[
            'name_required' => 'The name field is required.',
            'name_string' => 'The name must be a string.',
            'name_unique' => 'The name has already been taken.',
            'duration_required' => 'The duration field is required.',
            'template_id_required' => 'The template ID is required.',
            'template_id_exists' => 'The selected template ID does not exist in the coaching templates.',
            'module_name_required' => 'The module name is required.',
            'module_name_string' => 'The module name must be a string.',
            'module_name_max' => 'The module name may not be greater than 255 characters.',
            'is_active_required' => 'The active status is required.',
            'created_by_required' => 'The created by field is required.',
            'created_by_exists' => 'The selected created by user does not exist in the admin users.',
            'updated_by_required' => 'The updated by field is required.',
            'updated_by_exists' => 'The selected updated by user does not exist in the admin users.',
            'module_id_required' => 'The module ID is required.',
            'module_id_exists' => 'The selected module ID is invalid.',
            'activity_type_id_required' => 'The activity type ID is required.',
            'activity_type_id_exists' => 'The selected activity type ID is invalid.',
            'activity_name_required' => 'The activity name is required.',
            'activity_name_string' => 'The activity name must be a string.',
            'activity_name_max' => 'The activity name may not be greater than 255 characters.',
            'is_active_required' => 'The active status is required.',
            'is_active_boolean' => 'The active status must be true or false.',
            'due_date_required' => 'The due date is required.',
            'due_date_date' => 'The due date is not a valid date.',
            'points_required' => 'The points are required.',
            'points_integer' => 'The points must be an integer.',
            'points_min' => 'The points must be at least 0.',
            'activity_id_required' => 'Activity ID is required.',
            'activity_id_exists' => 'Activity ID does not exist.',
            'is_locked_required' => 'Is Locked field is required.',
            'is_locked_boolean' => 'Is Locked field must be a boolean value.',
            'lock_until_date_required' => 'Lock Until Date is required.',
            'lock_until_date_date' => 'Lock Until Date must be a valid date.',
            'time_required' => 'Time is required.',
            'time_integer' => 'Time must be an integer',
        ],
        'wol_tools'=>[
            'name_required' => 'The name field is required.',
            'name_string' => 'The name must be a string.',
            'coaching_tool_id_required' => 'The Coaching tools field is required.',
            'coaching_tool_id_integer' => 'The Coaching tool field must be integer.',
            'name_unique' => 'The name has already been taken.',
            'question_required' => 'The question field is required.',
            'question_string' => 'The question must be a string.',
            'wol_category_id_required' => 'The WOL Category field is required.',
            'wol_category_id_integer' => 'The WOL Category field must be integer.',
            'wol_category_id_exists'=>'The WOL Category Already Exits.',
            'question_unique' => 'The question has already been taken.',

            'minimum_scale_required' => 'The Minimum Scale field is required.',
            'minimum_scale_integer' => 'The Minimum Scale field must be integer.',
            'maximum_scale_required' => 'The Maximum Scale field is required.',
            'maximum_scale_integer' => 'The Maximum Scale field must be integer.',

            'number_of_categories_required' => 'The category ID field is required.',
            'number_of_categories_integer' => 'The selected category ID is invalid.',
            'number_of_questions_required' => 'The number of questions field is required.',
            'number_of_questions_integer' => 'The number of questions must be an integer.',

            'details_array' => 'The option config detils must be an array.',
            'details_point_integer' => 'The option config detils must be an integer.',
            'details_point_required_with' => 'The option config detils must be  required.',
            'details_text_string' => 'The option config text field must be string.',
            'details_icon_string' => 'The option config Icon field must be image.',
        ],
        'coach_profile'=>[
            'name_required' => 'The name field is required.',
            'name_string' => 'The name must be a string.',
            'name_max' => 'The name may not be greater than 255 characters.',
    
            'phone_required' => 'The phone field is required.',
            'phone_string' => 'The phone must be a string.',
            'phone_max' => 'The phone may not be greater than 20 characters.',
            'phone_unique' => 'The phone has already been taken.',
    
            'password_string' => 'The password must be a string.',
            'password_max' => 'The password may not be greater than 255 characters.',
    
            'location_string' => 'The location must be a string.',
            'location_nullable' => 'The location field is optional.',
    
            'address_required' => 'The address field is required.',
            'address_string' => 'The address must be a string.',
    
            'pincode_required' => 'The pincode field is required.',
            'pincode_string' => 'The pincode must be a string.',
    
            'time_zone_required' => 'The time zone field is required.',
            'time_zone_string' => 'The time zone must be a string.',
    
            'gender_required' => 'The gender field is required.',
            'gender_in' => 'The selected gender is invalid.',
    
            'date_of_birth_required' => 'The date of birth field is required.',
            'date_of_birth_date' => 'The date of birth is not a valid date.',
    
            'highest_qualification_string' => 'The highest qualification must be a string.',
            'highest_qualification_max' => 'The highest qualification may not be greater than 255 characters.',
    
            'profile_picture_nullable' => 'The profile picture field is optional.',
            'profile_picture_string' => 'The profile picture must be a string.',
    
            'profile_nullable' => 'The profile field is optional.',
            'profile_string' => 'The profile must be a string.',
    
            'about_me_nullable' => 'The about me field is optional.',
            'about_me_string' => 'The about me must be a string.',
    
            'is_active_boolean' => 'The is active field must be true or false.',
        ]
    ]
?>