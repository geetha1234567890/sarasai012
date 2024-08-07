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
        Schema::create('call_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('receiver_id');
            $table->string('meeting_link');
            $table->string('message');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['Request', 'Approved', 'Reject']);
            $table->string('reject_reason')->nullable();
            $table->timestamps();
            $table->foreign('sender_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('receiver_id')->references('id')->on('admin_users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_requests');
    }
};
