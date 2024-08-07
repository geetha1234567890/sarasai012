<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\TACoachStudentMapping;
use Modules\Admin\Models\TACoachBatchMapping;
use Modules\Admin\Models\StudentBatchMapping;
use Modules\Admin\Models\Student;
use Modules\Admin\Models\Batch;
use Modules\Admin\Models\Role;




class TaMappingController extends Controller
{
   
    public function getAssignStudents($TA_Id)
    {
        try {
            $taRole = Role::where('role_name', 'TA')->first();
            $ta = AdminUsers::whereHas('roles', function ($query) use ($taRole) {
                $query->where('role_id', $taRole->id);
            })->where('id', $TA_Id)->first();

            if (!$ta) {
                return response()->json(['message' => 'TA not found.'], 404);
            }

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


    

    public function getAssignBatches($TA_Id)
    {
        try {
            $taRole = Role::where('role_name', 'TA')->first();
            $ta = AdminUsers::whereHas('roles', function ($query) use ($taRole) {
                $query->where('role_id', $taRole->id);
            })->where('id', $TA_Id)->first();

            if (!$ta) {
                return response()->json(['message' => 'TA not found.'], 404);
            }

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
    
    /**
     * Store a newly created resource in storage.
     */
    public function assignStudents(Request $request)
    {
        try{
            $request->validate([
                'ta_id' => 'required|exists:admin_users,id',
                'student' => 'required|array',
                'student.*.id' => 'required|string',
            ]);

            $taRole = Role::where('role_name', 'TA')->first();
            $ta = AdminUsers::whereHas('roles', function ($query) use ($taRole) {
                $query->where('role_id', $taRole->id);
            })->where('id', $request->ta_id)->first();

            if (!$ta) {
                return response()->json(['message' => 'TA not found.'], 404);
            }

            foreach ($request->student as $studentData) {
                $student = TACoachStudentMapping ::updateOrCreate(
                    ['student_id' => $studentData['id'], 'admin_user_id' => $request['ta_id']],['is_deleted' => 0]
                );
            }
    
            return response()->json([
                'message' => 'Students assigned successfully',
                // 'ta' => $ta->load('student')
            ], 200);
        }
         catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Unexpected Error:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    
    public function assignBatches(Request $request)
    {
        try {
            
            $request->validate([
                'ta_id' => 'required|exists:admin_users,id',
                'batches' => 'required|array',
                'batches.*.id' => 'required|string',
            ]);

            $taRole = Role::where('role_name', 'TA')->first();
            $ta = AdminUsers::whereHas('roles', function ($query) use ($taRole) {
                $query->where('role_id', $taRole->id);
            })->where('id', $request->ta_id)->first();

            if (!$ta) {
                return response()->json(['message' => 'TA not found.'], 404);
            }
    
            foreach ($request->batches as $batchData) {
                TACoachBatchMapping::updateOrCreate([
                    'batch_id' => $batchData['id'],
                    'admin_user_id' => $request->ta_id,
                ],['is_deleted' => 0]);
                $studentListData = StudentBatchMapping::where('batch_id',  $batchData['id'])->get();
                foreach ($studentListData as $studentData) {
                    $student = TACoachStudentMapping ::updateOrCreate(
                        ['student_id' => $studentData['student_id'], 'admin_user_id' => $request->ta_id],['is_deleted' => 0]
                    );
                }
            }
    
            return response()->json([
                'message' => 'Batches assigned successfully',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Unexpected Error:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    
    



    public function TAswithActiveStudentnBatches()
    {
        try {
            $taRole = Role::where('role_name', 'TA')->first();
            $tas = AdminUsers::whereHas('roles', function ($query) use ($taRole) {
                $query->where('role_id', $taRole->id);
            })->get()->map(function ($ta) {
                $data = $ta->only(['id', 'name', 'username', 'is_active','time_zone']);
                
                // Count active batches assigned to this TA
                $batchCount = TACoachBatchMapping::where('admin_user_id', $ta->id)
                    ->where('is_deleted', false)
                    ->where('is_active', true)
                    ->count();
                    
                // Count active students assigned to this TA
                $studentCount = TACoachStudentMapping::where('admin_user_id', $ta->id)
                    ->where('is_deleted', false)
                    ->where('is_active', true)
                    ->count();
                
                // Add counts to the TA object
                $data['Active_Batches'] = $batchCount;
                $data['Active_Students'] = $studentCount;
                
                return $data;
            });

            if ($tas->isEmpty()) {
                return response()->json(['message' => 'TAs Not Found'], 404);
            }
        
            return response()->json($tas, 200);
        
        } catch (\Exception $e) {
            Log::error('Error fetching TA:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

     

    public function update(Request $request, $id): RedirectResponse
    {
        
    }

    public function ActiveDeactiveAssignStudent($id)
    {
        try {
            $mapping = TACoachStudentMapping ::find($id);
        if (!$mapping) {
            return response()->json(['message' => 'Mapping not found.'], 404);
        }
        $mapping->is_active = $mapping->is_active ? 0 : 1;
        $mapping->save();

        if($mapping->is_active){
            return response()->json(['message' => 'Student Activated successfully.']);
        }else{
            return response()->json(['message' => 'Student De-Activated successfully.']);
        }
        } catch (\Exception $e) {
            Log::error('Error Activeted Student:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    

    public function ActiveDeactiveAssignBatch($id)
    {
        try {
            $mapping = TACoachBatchMapping::find($id);

        if (!$mapping) {
            return response()->json(['message' => 'Mapping not found.'], 404);
        }

        // Soft delete the record by setting is_deleted to true
        $mapping->is_active = !$mapping->is_active;
        $mapping->save();
 
        // Retrieve batch_id and admin_user_id
        $batchId = $mapping->batch_id;
        $adminUserId = $mapping->admin_user_id;

        // Find all student IDs associated with the batch
        $studentIds = StudentBatchMapping::where('batch_id', $batchId)
            ->pluck('student_id')
            ->toArray();

        // Activate/deactivate students in tacoachstudentmapping
        foreach ($studentIds as $studentId) {
            $studentMapping = TACoachStudentMapping::where('admin_user_id', $adminUserId)
                ->where('student_id', $studentId)
                ->first();

            if ($studentMapping) {
                $studentMapping->is_active = $mapping->is_active ? 1 : 0;
                $studentMapping->save();
            }
            //print $studentMapping;
        }

        if($mapping->is_active){
            return response()->json(['message' => 'Batch Activated successfully.']);
        }else{
            return response()->json(['message' => 'Batch De-Activated successfully.']);
        }
        } catch (\Exception $e) {
            Log::error('Error Activeted Student:', ['message' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroyAssignStudents($id)
    {
        try {
            $mapping = TACoachStudentMapping ::find($id);

        if (!$mapping) {
            return response()->json(['message' => 'Mapping not found.'], 404);
        }

        // Soft delete the record by setting is_deleted to true
        $mapping->is_deleted = true;
        $mapping->save();

        return response()->json(['message' => 'Mapping deleted successfully.']);
        } catch (\Exception $e) {
            Log::error('Error deleting batch:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete batch'], 500);
        }
    }
    
    public function destroyAssignBatch($id)
    {
        try {
            $mapping = TACoachBatchMapping::find($id);
    
            if (!$mapping) {
                return response()->json(['message' => 'Mapping not found.'], 404);
            }
    
            $batchId = $mapping->batch_id;
            $adminUserId = $mapping->admin_user_id;
    
            $studentIds = StudentBatchMapping::where('batch_id', $batchId)
                ->pluck('student_id')
                ->toArray();
    
            $mapping->delete();
    
            foreach ($studentIds as $studentId) {
                $studentMapping = TACoachStudentMapping::where('admin_user_id', $adminUserId)
                    ->where('student_id', $studentId)
                    ->first();
    
                if ($studentMapping) {
                    $studentMapping->delete();
                }
            }
    
            return response()->json(['message' => 'Batch and related students deleted successfully.']);
        } catch (\Exception $e) {
            Log::error('Error deleting batch and students:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete batch and students'], 500);
        }
    }

}
