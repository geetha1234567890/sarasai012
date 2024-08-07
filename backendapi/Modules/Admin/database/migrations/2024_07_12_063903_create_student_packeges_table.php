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
        Schema::create('student_packeges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('package_id')->nullable(); 
            $table->string('package_name')->nullable(false);
            $table->unsignedBigInteger('student_id');
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
             $table->timestamps(); // This will add the created_at and updated_at columns

            // Define foreign key with unique constraint names
            $table->foreign('student_id', 'fk_package_student_id')
            ->references('id')->on('students')->onDelete('cascade');
            $table->foreign('created_by', 'fk_package_created_by')
            ->references('id')->on('admin_users')->onDelete('set null');
            $table->foreign('updated_by', 'fk_package_updated_by')
            ->references('id')->on('admin_users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_packeges');
    }
};
