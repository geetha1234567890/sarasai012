<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->renameColumn('student_lms_id', 'enrollment_id');
            $table->string('center')->nullable();
            $table->unsignedBigInteger('time_zone_id');
            $table->dropColumn('email');
            $table->dropColumn('academic_term');
            $table->dropColumn('class_id');
            $table->dropColumn('board_id');
            $table->dropColumn('stream_id');
            $table->dropColumn('phone');
            $table->dropColumn('primary_phone');
            $table->dropColumn('primary_email');
            $table->foreign('time_zone_id', 'fk_student_time_zone')
            ->references('id')->on('country_time_zones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'time_zone_id')) {
                $table->dropForeign('fk_student_time_zone');
                $table->dropColumn('time_zone_id');
            }

            if (Schema::hasColumn('students', 'enrollment_id')) {
                $table->renameColumn('enrollment_id', 'student_lms_id');
            }

            if (Schema::hasColumn('students', 'center')) {
                $table->dropColumn('center');
            }

            if (!Schema::hasColumn('students', 'email')) {
                $table->string('email')->nullable();
            }

            if (!Schema::hasColumn('students', 'academic_term')) {
                $table->string('academic_term')->nullable();
            }

            if (!Schema::hasColumn('students', 'class_id')) {
                $table->string('class_id')->nullable();
            }

            if (!Schema::hasColumn('students', 'board_id')) {
                $table->string('board_id')->nullable();
            }

            if (!Schema::hasColumn('students', 'stream_id')) {
                $table->string('stream_id')->nullable();
            }

            if (!Schema::hasColumn('students', 'phone')) {
                $table->string('phone')->nullable();
            }

            if (!Schema::hasColumn('students', 'primary_phone')) {
                $table->string('primary_phone')->nullable();
            }

            if (!Schema::hasColumn('students', 'primary_email')) {
                $table->string('primary_email')->nullable();
            }
        });

    }
};


