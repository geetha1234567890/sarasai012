<?php

namespace Modules\TA\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\TACoachStudentMapping;
use Modules\Admin\Models\TACoachBatchMapping;
use Modules\Admin\Models\StudentBatchMapping;
use Modules\Admin\Models\Student;
use Modules\Admin\Models\Batch;

use Auth;

class TAStudentBatchMappingController extends Controller
{
    public function getAssignStudents()
    {
        try {
            $TA_Id = auth()->user()->id;
            $mappings = TACoachStudentMapping::with(['AdminUsers', 'Student.studentBatchMappings.Batch'])
                        ->where('is_deleted', false)
                        ->where('admin_user_id', $TA_Id)
                        ->get();

            $data = $mappings->map(function($mapping) {
                $student = $mapping->student;
                $batches = $student->studentBatchMappings->map(function ($studentBatchMapping) {
                    return [
                        'batch_id' => $studentBatchMapping->batch->id,
                        'batch_name' => $studentBatchMapping->batch->name,
                        'branch' => [
                                'id' => $studentBatchMapping->batch->parent->id,
                                'name' =>$studentBatchMapping->batch->parent->name
                        ],
                        'is_active' => $studentBatchMapping->batch->is_active,
                    ];
                });

                return [
                    'id' => $mapping->id,
                    'ta' => [
                        'id' => $mapping->AdminUsers->id,
                        'name' => $mapping->AdminUsers->name,
                    ],
                    'student' => [
                        'id' => $student->id,
                        'name' => $student->name,
                        'enrollment_id' => $student->enrollment_id,
                        'packages' => $student->packages->map(function ($package) {
                            return [
                                'id' => $package->id,
                                'package_id' => $package->package_id,
                                'name' => $package->package_name,
                            ];
                        }),
                        'batches' => $batches,
                    ],
                    'is_active' => $mapping->is_active,
                ];
            });

            return response()->json($data, 200);

        } catch (\Exception $e) {
            Log::error('Error fetching TAs:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getAssignBatches()
    {
        try {
            $TA_Id = auth()->user()->id;

            $mappings = TACoachBatchMapping::with(['AdminUsers', 'batch'])
                        ->where('is_deleted', false)
                        ->where('admin_user_id', $TA_Id)
                        ->get();
    
            $data = $mappings->map(function($mapping) {
                return [
                    'id' => $mapping->id,
                    'ta' => [
                        'id' => $mapping->AdminUsers->id,
                        'name' => $mapping->AdminUsers->name,
                    ],
                    'batch' => [
                        'id' => $mapping->batch->id,
                        'name' => $mapping->batch->name,
                        'branch' => [
                            'id' => $mapping->batch->parent->id,
                            'name' => $mapping->batch->parent->name
                        ],
                    ],
                    'is_active' => $mapping->is_active,
                    // 'is_deleted' => $mapping->is_deleted,
                ];
            });
    
            return response()->json($data, 200);
    
        } catch (\Exception $e) {
            Log::error('Error fetching batches:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
