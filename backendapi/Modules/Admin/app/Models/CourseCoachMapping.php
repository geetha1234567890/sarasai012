<?php

namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\Factories\CourseCoachMappingFactory;

class CourseCoachMapping extends Model
{
    use HasFactory;

    protected $table = 'course_coach_mappings';

    protected $fillable = [
        'course_id',
        'coach_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function coach()
    {
        return $this->belongsTo(AdminUsers::class, 'id', 'coach_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(AdminUsers::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(AdminUsers::class, 'updated_by');
    }

    protected static function newFactory(): CourseCoachMappingFactory
    {
        //return CourseCoachMappingFactory::new();
    }
}
