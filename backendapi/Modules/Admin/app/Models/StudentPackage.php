<?php

namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPackage extends Model
{
    use HasFactory;

    protected $table = 'student_packages';

    protected $fillable = [
        'package_id',
        'package_name',
        'student_id',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id','id');
    }

    public function createdBy()
    {
        return $this->belongsTo(AdminUser::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(AdminUser::class, 'updated_by');
    }
}

