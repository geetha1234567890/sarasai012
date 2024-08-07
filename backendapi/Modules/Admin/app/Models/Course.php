<?php

namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\Factories\CourseFactory;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'name',
        'is_active',
        'description',
        'end_date',
        'start_date',
        'time_zone_id',
    ];

    public function coaches() {
        return $this->belongsToMany(AdminUsers::class, 'course_coach_mappings', 'course_id', 'coach_id');
    
    }

    public function students() {
        return $this->belongsToMany(Student::class, 'course_student_mappings', 'course_id', 'student_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(AdminUsers::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(AdminUsers::class, 'updated_by');
    }

    

    protected static function newFactory(): CourseFactory
    {
        //return CourseFactory::new();
    }
}
