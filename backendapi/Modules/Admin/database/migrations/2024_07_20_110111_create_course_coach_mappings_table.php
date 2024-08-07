<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_coach_mappings', function (Blueprint $table) {
            $table->unsignedBigInteger('coach_id');
            $table->unsignedBigInteger('course_id');
            $table->primary(['coach_id', 'course_id']);
            $table->timestamps();
            $table->foreign('coach_id')->references('id')->on('admin_users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_coach_mappings');
    }
};
