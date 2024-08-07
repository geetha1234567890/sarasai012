<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameStudentPackegesToStudentPackages extends Migration
{
    public function up()
    {
        Schema::rename('student_packeges', 'student_packages');
    }

    public function down()
    {
        Schema::rename('student_packages', 'student_packeges');
    }
};
