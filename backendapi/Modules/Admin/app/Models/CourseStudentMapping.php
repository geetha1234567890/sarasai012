<?php

namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\Factories\CourseStudentMappingFactory;

class CourseStudentMapping extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'student_id',
        'course_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id')->with('packages');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(AdminUsers::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(AdminUsers::class, 'updated_by');
    }


    protected static function newFactory(): CourseStudentMappingFactory
    {
        //return CourseStudentMappingFactory::new();
    }
}
