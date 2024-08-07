<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\AdminController;
use Modules\Admin\Http\Controllers\API\BatchController;
use Modules\Admin\Http\Controllers\API\CallRequestController;
use Modules\Admin\Http\Controllers\API\StudentController;
use Modules\Admin\Http\Controllers\API\TaMappingController;

use Modules\Admin\Http\Controllers\API\manageTasController;
use Modules\Admin\Http\Controllers\API\manageCoachesController;
use Modules\Admin\Http\Controllers\API\TaAvailabilityController;
use Modules\Admin\Http\Controllers\API\CoachAvailabilityController;
use Modules\Admin\Http\Controllers\API\CoachMappingController;
use Modules\Admin\Http\Controllers\API\CoachSchedulingController;
use Modules\Admin\Http\Controllers\API\TASchedulingController;
use Modules\Admin\Http\Controllers\API\TACoachSlotsController;
use Modules\Admin\Http\Controllers\API\LeaveController;
use Modules\Admin\Http\Controllers\API\StudentBatchMappingController;
use Modules\Admin\Http\Controllers\API\CoachingToolController;
use Modules\Admin\Http\Controllers\API\WOLCoachingToolController;
use Modules\Admin\Http\Controllers\API\CoachingTemplateController;
use Modules\Admin\Http\Controllers\API\TimeZoneController;
use Modules\Admin\Http\Controllers\API\AuthController;
use Modules\Admin\Http\Controllers\API\CourseController;
use Modules\Admin\Http\Controllers\API\CourseStudentMappingController;
use Modules\Admin\Http\Controllers\API\CourseCoachMappingController;
use App\Http\Middleware\EnsureUserHasRole;

Route::post('/login',[AuthController::class,'login'])->name('login');

Route::middleware(['auth:admin-api', 'role:admin'])->group(function () {
    Route::post('/logout',[AuthController::class,'logout']);
});

Route::prefix('v1')->group(function () {


    Route::get('timezones', [TimeZoneController::class, 'GetAllTimeZones']);
    Route::prefix('admin')->name('admin.')->group(function () {
        // Route::apiResource('admin', AdminController::class)->names('admin');
        
        Route::apiResource('batches', BatchController::class);
        Route::apiResource('courses', CourseController::class);
        Route::apiResource('call_requests', CallRequestController::class);
        Route::apiResource('students', StudentController::class);
        Route::put('students', [StudentController::class, 'update']);
        Route::apiResource('manage_tas', manageTasController::class);
        Route::apiResource('manage_coaches', manageCoachesController::class);

        //slots
        Route::prefix('coach-slots')->group(function () {
            Route::post('/', [TACoachSlotsController::class, 'store']);
            Route::delete('/{id}', [TACoachSlotsController::class, 'destroy']);
            Route::get('/{id}', [TACoachSlotsController::class, 'index']);
            Route::post('/records', [TACoachSlotsController::class, 'getTACoachRecords']);
            Route::post('/getTACoachSlotForADate', [TACoachSlotsController::class, 'getTACoachSlotForDate']);
        });

        //Ta Scheduling//
        Route::prefix('taschedules')->group(function () {
            Route::post('/', [TASchedulingController::class, 'store']);
            Route::post('/get-schedules-records', [TASchedulingController::class, 'getScheduledRecords']);
            Route::post('/{Ta_Id}', [TASchedulingController::class, 'getOneTaRecords']);
            Route::get('/{id}', [TASchedulingController::class, 'getOneTaSessions']);
            Route::put('/{id}', [TASchedulingController::class, 'update']);
            Route::delete('/{recordId}', [TASchedulingController::class, 'destroy']);
            Route::put('/{recordId}/cancel', [TASchedulingController::class, 'cancel']);
            Route::get('/', [TASchedulingController::class,'index']);
        });

        //Coach Scheduling//
        Route::prefix('coachschedules')->group(function () {
            Route::post('/', [CoachSchedulingController::class, 'store']);
            Route::post('/get-schedules-records', [CoachSchedulingController::class, 'getScheduledRecords']);
            Route::post('/{Coach_Id}', [CoachSchedulingController::class, 'getOneCoachRecords']);
            Route::get('/{id}', [CoachSchedulingController::class, 'getOneCoachSessions']);
            Route::put('/{id}', [CoachSchedulingController::class, 'update']);
            Route::delete('/{recordId}', [CoachSchedulingController::class, 'destroy']);
            Route::put('/{recordId}/cancel', [CoachSchedulingController::class, 'cancel']);
            Route::get('/', [CoachSchedulingController::class,'index']);
        });

        //Coaching tools
        Route::post('/store-coaching-tools', [WOLCoachingToolController::class, 'store']);
        
        // Coaching template
        Route::post('/store-template', [CoachingTemplateController::class, 'storeTemplate']);
        Route::prefix('coaching-templates')->group(function () {
            Route::post('/store-modules', [CoachingTemplateController::class, 'storeModule'])->name('coaching-templates.modules.store');
            Route::post('/update-modules', [CoachingTemplateController::class, 'updateModule'])->name('coaching-templates.modules.update');
            Route::get('/', [CoachingTemplateController::class, 'getAllTemplates']);
            Route::get('/modules/{id}', [CoachingTemplateController::class, 'getTemplateModules']);
            Route::post('/store-activity', [CoachingTemplateController::class, 'storeActivity']);
            Route::post('/DeletelinkedActivity', [CoachingTemplateController::class, 'DeletelinkedActivity']);
            Route::get('/activity-type', [CoachingTemplateController::class, 'getActivityType']);
            Route::post('/activity-prerequisite', [CoachingTemplateController::class, 'activityPrerequisite']);
            Route::post('/update-activity', [CoachingTemplateController::class, 'updateActivity']);
            Route::post('/activity-status', [CoachingTemplateController::class, 'activityStatus']);  
            Route::post('/template-status', [CoachingTemplateController::class, 'templateStatus']);  
            Route::post('/link-activity', [CoachingTemplateController::class, 'linkActivity']);
            Route::post('/template-assign', [CoachingTemplateController::class, 'templateAssign']);
        });
        // Route::post('/generate-api-key', [CoachingTemplateController::class, 'generateApiKey'])->withoutMiddleware([AuthMiddleware::class]);

        //Leave
        Route::post('leave', [LeaveController::class, 'store']);
        Route::get('get-leave-details', [LeaveController::class, 'getLeaveDetails']);
        Route::post('get-specific-user-slot-within-date-range', [TACoachSlotsController::class, 'getTACoachRecords']);

        //Ta availability
        Route::prefix('TA-availability')->group(function () {
            Route::get('get-today-available-ta', [TaAvailabilityController::class, 'index']);
            Route::post('create', [TaAvailabilityController::class, 'store']);
            Route::get('{id}', [TaAvailabilityController::class, 'show']);
            Route::put('update/{id}', [TaAvailabilityController::class, 'update']);
            Route::delete('delete/{id}', [TaAvailabilityController::class, 'destroy']);
            Route::patch('change-status/{id}', [TaAvailabilityController::class, 'changeAvailabilityStatus']);
        });

        Route::prefix('Coach-availability')->group(function () {
            Route::get('get-today-available-coach', [CoachAvailabilityController::class, 'index']);
            Route::post('create', [CoachAvailabilityController::class, 'store']);
            Route::get('{id}', [CoachAvailabilityController::class, 'show']);         
            Route::put('update/{id}', [CoachAvailabilityController::class, 'update']);       
            Route::delete('delete/{id}', [CoachAvailabilityController::class, 'destroy']);     
            Route::patch('change-status/{coach_availability_id}', [CoachAvailabilityController::class, 'changeAvailabilityStatus']);
        });
    
        ///////////////////////////TA Mapping///////////////////////////////
        Route::prefix('TAMapping')->group(function () {
            Route::get('{TA_Id}/AssignStudents', [TaMappingController::class, 'getAssignStudents']);
            Route::get('{TA_Id}/AssignBatches', [TaMappingController::class, 'getAssignBatches']);
            Route::post('AssignStudents', [TaMappingController::class, 'assignStudents']);
            Route::post('AssignBatches', [TaMappingController::class, 'assignBatches']);
            Route::get('/TAswithActiveStudentnBatches', [TaMappingController::class, 'TAswithActiveStudentnBatches']);
            Route::put('{id}/ActiveDeactiveAssignStudent', [TaMappingController::class, 'ActiveDeactiveAssignStudent']);
            Route::put('{id}/ActiveDeactiveAssignBatch', [TaMappingController::class, 'ActiveDeactiveAssignBatch']);
            Route::delete('{id}/deleteStudent', [TaMappingController::class, 'destroyAssignStudents']);
            Route::delete('{id}/deleteBatch', [TaMappingController::class, 'destroyAssignBatch']);
        });

         ////////////////////Coach Mapping///////////////////////////
         Route::prefix('CoachMapping')->name('CoachMapping')->group(function () {
            Route::get('{Coach_Id}/AssignStudents', [CoachMappingController::class, 'getAssignStudents']);
            Route::get('{Coach_Id}/AssignBatches', [CoachMappingController::class, 'getAssignBatches']);
            Route::post('AssignStudents', [CoachMappingController::class, 'assignStudents']);
            Route::post('AssignBatches', [CoachMappingController::class, 'assignBatches']);

            Route::get('/CoachswithActiveStudentnBatches', [CoachMappingController::class, 'CoachswithActiveStudentnBatches']);

            Route::put('{id}/ActiveDeactiveAssignStudent', [CoachMappingController::class, 'ActiveDeactiveAssignStudent']);

            Route::put('{id}/ActiveDeactiveAssignBatch', [CoachMappingController::class, 'ActiveDeactiveAssignBatch']);

            Route::delete('{id}/deleteStudent', [CoachMappingController::class, 'destroyAssignStudents']);
            Route::delete('{id}/deleteBatch', [CoachMappingController::class, 'destroyAssignBatch']);
        });
        
        Route::prefix('student-batch-mapping')->group(function () {
            Route::get('/', [StudentBatchMappingController::class, 'index']);
            Route::post('/', [StudentBatchMappingController::class, 'store']);
            Route::get('/getAllStudentWithBatches', [StudentBatchMappingController::class, 'getAllStudentWithBatch']);
            Route::get('/batches/{studentId}', [StudentBatchMappingController::class, 'getBatchesForStudent']);
            Route::get('/students/{batchId}', [StudentBatchMappingController::class, 'getStudentsInBatch']);
            Route::put('/update-batch/{student_id}', [StudentBatchMappingController::class, 'updateBatchForStudent']);
            Route::put('/update-student/{batch_id}', [StudentBatchMappingController::class, 'updateStudentForBatch']);
            Route::delete('/{student_id}/{batch_id}', [StudentBatchMappingController::class, 'destroy']);
        });

        ////////////////////////////////Student Course Mapping///////////////////////////

        Route::prefix('student-course')->group(function () {
            Route::post('/', [CourseStudentMappingController::class, 'store']);
            Route::get('/getAllStudentWithCourse', [CourseStudentMappingController::class, 'getAllStudentWithCourse']);
            Route::get('/getAllCoursesWithStudent', [CourseStudentMappingController::class, 'getAllCoursesWithStudent']);
            Route::get('/courses/{studentId}', [CourseStudentMappingController::class, 'getCoursesForStudent']);
            Route::get('/students/{courseId}', [CourseStudentMappingController::class, 'getStudentsInCourse']);
            Route::delete('/{student_id}/{course_id}', [CourseStudentMappingController::class, 'destroy']);
        });


        Route::prefix('coach-course')->group(function () {
            Route::post('/', [CourseCoachMappingController::class, 'store']);
            Route::get('/coaches/{course_id}', [CourseCoachMappingController::class, 'showCoachesForCourse']);
            Route::get('/courses/{coach_id}', [CourseCoachMappingController::class, 'showCoursesForCoach']);
            Route::get('/getAllCoursesWithCoaches', [CourseCoachMappingController::class, 'getAllCoursesWithCoaches']);
            Route::get('/getAllCoachesWithCourses', [CourseCoachMappingController::class, 'getAllCoachesWithCourses']);
        });



        Route::prefix('coaching-tool')->group(function () {
            Route::get('/', [CoachingToolController::class, 'index']);
            Route::post('/', [CoachingToolController::class, 'store']);
            Route::put('/{id}', [CoachingToolController::class, 'update']);
            Route::delete('/{id}', [CoachingToolController::class, 'destroy']);
        });

        Route::prefix('wol')->group(function () {
            // Route::post('/wol-data', [WOLCoachingToolController::class, 'store_WOLData']);
            // Route::get('/wol-data', [WOLCoachingToolController::class, 'get_WOLData']);

            Route::post('/wol-category', [WOLCoachingToolController::class, 'store_WOLCategory']);
            Route::get('/wol-category', [WOLCoachingToolController::class, 'get_WOLCategory']);
            Route::get('/wol-category/{id}', [WOLCoachingToolController::class, 'update_StatusWOLCategory']);
            Route::put('/wol-category/{id}', [WOLCoachingToolController::class, 'update_WOLCategory']);
            
            Route::post('/wol-life-instruction', [WOLCoachingToolController::class, 'store_WOLLifeInstruction']);
            Route::get('/wol-life-instruction', [WOLCoachingToolController::class, 'get_WOLLifeInstruction']);
            Route::put('/wol-life-instruction', [WOLCoachingToolController::class, 'update_WOLLifeInstruction']);
            Route::post('/wol-question', [WOLCoachingToolController::class, 'store_WOLQuestion']);
            Route::get('/wol-question', [WOLCoachingToolController::class, 'get_WOLQuestion']);
            Route::get('/wol-question-category-wise/{id}', [WOLCoachingToolController::class, 'get_WOLQuestionCategoryWise']);
            Route::get('/wol-question/{id}', [WOLCoachingToolController::class, 'update_StatusWOLQuestion']);
            Route::put('/wol-question/{id}', [WOLCoachingToolController::class, 'update_WOLQuestion']);
            
            Route::post('/wol-option-config', [WOLCoachingToolController::class, 'store_WOLOptionConfig']);
            Route::get('/wol-option-config', [WOLCoachingToolController::class, 'get_WOLOptionConfig']);
            Route::post('/wol-option-config-update', [WOLCoachingToolController::class, 'update_WOLOptionConfig']);

            Route::post('/wol-test-config', [WOLCoachingToolController::class, 'store_WOLTestConfig']);
            Route::get('/wol-test-config', [WOLCoachingToolController::class, 'get_WOLTestConfig']);
            Route::post('/wol-test-config-update', [WOLCoachingToolController::class, 'update_WOLTestConfig']);

            Route::post('/wol-test-config-add-question-to-category', [WOLCoachingToolController::class, 'store_WOLConfigTestQuestionToCategory']);
            Route::get('/wol-test-config-category-question-count', [WOLCoachingToolController::class, 'get_WOLConfigTestQuestion']);
            Route::get('/wol-test-config-selected-question-list/{id}', [WOLCoachingToolController::class, 'get_WOLConfigTestSelectedQuestionCategoryWise']);
            // Route::post('/wol-test-config-update', [WOLCoachingToolController::class, 'update_WOLTestConfig']);
        });
    });
    });










