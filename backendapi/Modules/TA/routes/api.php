<?php

use Illuminate\Support\Facades\Route;
use Modules\TA\Http\Controllers\API\TAProfileController;
use Modules\TA\Http\Controllers\API\TACalenderController;
use Modules\Admin\Http\Controllers\API\AuthController;
use Modules\TA\Http\Controllers\API\TAStudentBatchMappingController;


Route::middleware(['auth:admin-api', 'role:TA'])->group(function () {
    Route::post('/logout',[AuthController::class,'logout']);
    Route::prefix('v1')->group(function () {
        Route::prefix('ta')->name('ta.')->group(function () {
            Route::get('ta-profile', [TAProfileController::class, 'GetUser'])->name('profile');
            Route::put('ta-profile', [TAProfileController::class, 'Update'])->name('update');
            Route::prefix('calendar')->name('calendar.')->group(function () {
                Route::get('slots', [TACalenderController::class, 'getAllSlots'])->name('slots');
                Route::post('slots-by-date', [TACalenderController::class, 'getAllSlotByDate' ])->name('slots-by-date');
                Route::get('sessions',[TACalenderController::class, 'getAllSessions'])->name('sessions');
                Route::post('create-slots', [TACalenderController::class, 'storeSlots'])->name('create-slots');
                Route::post('create-sessions', [TACalenderController::class, 'storeSchedules'])->name('create-sessions');
                Route::post('create-leave', [TACalenderController::class, 'storeLeave'])->name('create-leave');
            });

            Route::get('get-students', [TAStudentBatchMappingController::class, 'getAssignStudents'])->name('get-students');
            Route::get('get-batches', [TAStudentBatchMappingController::class, 'getAssignBatches'])->name('get-batches');

            
        });
    });
});