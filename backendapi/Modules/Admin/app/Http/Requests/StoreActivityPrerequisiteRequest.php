<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityPrerequisiteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * This function returns the validation rules for the request data.
     *
     * @return array The validation rules.
     */
    public function rules()
    {
        return [
            'module_id' => 'nullable|exists:coaching_template_modules,id',
            'activity_id' => 'nullable|exists:coaching_template_module_activities,id',
            'template_id' => 'nullable|exists:coaching_templates,id',
            'is_locked' => 'nullable|boolean',
            'lock_until_date' => 'required|date',
            'time' => 'required',
        ];
    }
    
    /**
     * Get the error messages for the defined validation rules.
     *
     * This function returns the custom error messages for each validation rule.
     *
     * @return array The error messages.
     */
    public function messages()
    {
        return [
            'module_id.exists' => __('Admin::validation_message.coaching_template.module_id_exists'),
            'activity_id.required' => __('Admin::validation_message.coaching_template.activity_id_required'),
            'activity_id.exists' => __('Admin::validation_message.coaching_template.activity_id_exists'),
            'template_id.exists' => __('Admin::validation_message.coaching_template.template_id_exists'),
            'is_locked.boolean' => __('Admin::validation_message.coaching_template.is_locked_boolean'),
            'is_active.required' => __('Admin::validation_message.coaching_template.is_active_required'),
            'lock_until_date.required' => __('Admin::validation_message.coaching_template.lock_until_date_required'),
            'lock_until_date.date' => __('Admin::validation_message.coaching_template.lock_until_date_date'),
            'time.required' => __('Admin::validation_message.coaching_template.time_required'),
        ];
    }
}

