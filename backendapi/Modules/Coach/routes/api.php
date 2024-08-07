<?php

use Illuminate\Support\Facades\Route;
use Modules\Coach\Http\Controllers\CoachController;
use Modules\Coach\Http\Controllers\API\CoachesProfileController;
use Modules\Coach\Http\Controllers\API\CoachCalenderController;
use Modules\Coach\Http\Controllers\API\CoachScheduleCallController;
use Modules\Coach\Http\Controllers\API\CoachCallRequestController;
use Modules\Admin\Http\Controllers\API\AuthController;
use Modules\Coach\Http\Controllers\API\CoachStudentBatchMappingController;


Route::middleware(['auth:admin-api', 'role:Coach'])->group(function () {
    Route::post('/logout',[AuthController::class,'logout']);
    Route::prefix('v1')->group(function () {
        Route::prefix('coach')->name('coach.')->group(function () {
            Route::get('coach-profile', [CoachesProfileController::class, 'GetUser'])->name('profile');
            Route::put('coach-profile', [CoachesProfileController::class, 'Update'])->name('update');

            Route::prefix('calendar')->name('calendar.')->group(function () {
                Route::get('slots', [CoachCalenderController::class, 'getAllSlots'])->name('slots');
                Route::get('sessions', [CoachCalenderController::class, 'getAllSessions'])->name('sessions');
                Route::post('slots-by-date', [CoachCalenderController::class, 'getAllSlotByDate' ])->name('slots-by-date');
                Route::post('create-slots', [CoachCalenderController::class, 'storeSlots'])->name('create-slots');
                Route::post('create-sessions', [CoachCalenderController::class, 'storeSchedules'])->name('create-sessions');
                Route::post('create-leave', [CoachCalenderController::class, 'storeLeave'])->name('create-leave');
            });


            Route::get('get-students', [CoachStudentBatchMappingController::class, 'getAssignStudents'])->name('get-students');
            Route::get('get-batches', [CoachStudentBatchMappingController::class, 'getAssignBatches'])->name('get-batches');

            Route::prefix('schedule-call')->name('schedule-call.')->group(function () {
                Route::post('get-schedule-call', [CoachScheduleCallController::class, 'getScheduleCall'])->name('get-schedule-call');
            });

            Route::prefix('call-request')->name('call-request.')->group(function () {
                Route::get('get-call-request', [CoachCallRequestController::class, 'getAllCallRequest']);
                Route::get('approve-call-request/{id}', [CoachCallRequestController::class, 'approveCallRequest']);
                Route::put('denie-call-request/{id}', [CoachCallRequestController::class, 'deniedCallRequest']);
            });
            
        });
    });

});