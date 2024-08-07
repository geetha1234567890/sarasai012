<?php

namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\Factories\AdminUsersFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class AdminUsers extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $guard = 'admin-api';

    protected $table = 'admin_users';

    protected $fillable = [
        'name', 'username','email','phone', 'password', 'location', 'address','pincode', 'time_zone', 'gender',
        'date_of_birth', 'highest_qualification', 'profile_picture', 'profile',
        'about_me', 'is_active', 'created_by', 'updated_by'
    ];

    protected $hidden = [
        'password', 
        'remember_token',
    ];

    
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function taAvailabilities()
    {
        return $this->hasMany(TaAvailability::class, 'admin_user_id','id');
    }

    public function createdTaAvailabilities()
    {
        return $this->hasMany(TaAvailability::class, 'created_by','id');
    }

    public function updatedTaAvailabilities()
    {
        return $this->hasMany(TaAvailability::class, 'updated_by','id');
    }

    public function taScheduling()
    {
        return $this->hasOne(TAScheduling::class, 'ta_id');
    }

    public function taMapping()
    {
        return $this->hasOne(TAMapping::class, 'ta_id');
    }

    public function coachAvailability()
    {
        return $this->hasOne(CoachAvailability::class, 'coach_id');
    }

    public function coachScheduling()
    {
        return $this->hasOne(CoachScheduling::class, 'coach_id');
    }

    public function coachMapping()
    {
        return $this->hasOne(CoachMapping::class, 'coach_id');
    }


    public function leaves()
    {
        return $this->hasMany(Leaves::class, 'admin_user_id');
    }


    public function taCoachSlots()
    {
        return $this->hasMany(TACoachSlots::class, 'admin_user_id','id');
    }

    public function student()
    {
        return $this->hasManyThrough(Student::class, TACoachStudentMapping::class, 'admin_user_id', 'id', 'id', 'student_id');
    }

    public function batches()
    {
        return $this->hasManyThrough(Batch::class, TACoachBatchMapping::class, 'admin_user_id', 'id', 'id', 'batch_id');
    }

    public function courses()
    {
        return $this->hasManyThrough(Course::class, CourseCoachMapping::class, 'coach_id', 'id', 'id', 'course_id');
    }

    public function taCoachBatchMappings()
    {
        return $this->hasMany(TACoachBatchMapping::class, 'admin_user_id');
    }

}
