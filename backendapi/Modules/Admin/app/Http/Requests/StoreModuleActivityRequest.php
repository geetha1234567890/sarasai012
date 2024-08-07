<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuleActivityRequest extends FormRequest
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
            'module_id' => 'required|exists:coaching_template_modules,id',
            'activity_name' => 'required|string|max:255',
            'due_date' => 'required|date',
            'points' => 'required|integer|min:0',
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
            'module_id.required' => __('Admin::validation_message.coaching_template.module_id_required'),
            'module_id.exists' => __('Admin::validation_message.coaching_template.module_id_exists'),
            'activity_name.required' => __('Admin::validation_message.coaching_template.activity_name_required'),
            'activity_name.string' => __('Admin::validation_message.coaching_template.activity_name_string'),
            'activity_name.max' => __('Admin::validation_message.coaching_template.activity_name_max'),
            'due_date.required' => __('Admin::validation_message.coaching_template.due_date_required'),
            'due_date.date' => __('Admin::validation_message.coaching_template.due_date_date'),
            'points.required' => __('Admin::validation_message.coaching_template.points_required'),
            'points.integer' => __('Admin::validation_message.coaching_template.points_integer'),
            'points.min' => __('Admin::validation_message.coaching_template.points_min'),
        ];
    }
}

