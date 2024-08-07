<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCoachingTemplateRequest extends FormRequest
{
   
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'duration' => 'required',
        ];
    }

    /**
     * Get the custom validation messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => __('Admin::validation_message.coaching_template.name_required'),
            'name.string' => __('Admin::validation_message.coaching_template.name_string'),
            'name.unique' => __('Admin::validation_message.coaching_template.name_unique'),
            'duration.required' => __('Admin::validation_message.coaching_template.duration_required'),
        ];
    }
}
