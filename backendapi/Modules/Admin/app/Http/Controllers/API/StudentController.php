<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Modules\Admin\Models\Student;
use Modules\Admin\Models\StudentPackage; 
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $students = Student::with('packages')->get(); // Load packages relationship
            return response()->json($students);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Failed to retrieve students', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'enrollment_id' => 'required|string|max:255', // Changed from student_lms_id
                'is_active' => 'required|boolean',
                'time_zone_id' => 'required|integer',
                'center' => 'nullable|string|max:255',
                'packages' => 'required|array|min:1', // Ensure at least one package is provided
                'packages.*.Id' => 'required|string|max:255', // Changed to string
                'packages.*.Name' => 'required|string|max:255',
            ]);
    
            // Begin a database transaction
            DB::beginTransaction();
    
            if(!Student::where('enrollment_id',$request->enrollment_id)->exists()){

                // Create the student
                $studentData = [
                    'name' => $request->name,
                    'enrollment_id' => $request->enrollment_id,
                    'is_active' => $request->is_active,
                    'time_zone_id' => $request->time_zone_id,
                    'center' => $request->center,
                ];
        
                $student = Student::create($studentData);
        
                // Create packages associated with the student
                foreach ($request->packages as $package) {
                    $packageData = [
                        'package_id' => $package['Id'],
                        'package_name' => $package['Name'],
                        'student_id' => $student->id,
                        'is_active' => true, // You may adjust this as needed
                        'created_by' => auth()->id(), // Example: Set the current authenticated user
                        'updated_by' => auth()->id(),
                    ];
        
                    StudentPackage::create($packageData);
                }
        
                // Commit the transaction
                DB::commit();
                
                return response()->json($student, 201);
            }
            return response()->json(['message' => 'Student already exists with this enrollment ID'], 409); // Conflict 409

        } catch (ValidationException $e) {
            // Rollback the transaction on validation error
            DB::rollBack();
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Rollback the transaction on any other exception
            DB::rollBack();
            return response()->json(['message' => 'Failed to create student', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {

            $student = Student::with('packages')->find($id); // Load packages relationship\
        
            if($student){
                return response()->json($student, 200);
            }
            return response()->json(['message' => 'Student does not exist'], 404);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Student not found', 'error' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve student', 'error' => $e->getMessage()], 500);
        }
    }

/**
 * Update the specified resource in storage.
 */
public function update(Request $request, $enrollment_id)
{
    try {
        $student = Student::where('enrollment_id', $enrollment_id)->first();

        if (!$student) {
            throw new ModelNotFoundException('Student not found');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'enrollment_id' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'time_zone_id' => 'required|integer',
            'center' => 'nullable|string|max:255',
            'packages' => 'required|array',
            'packages.*.Id' => 'required|string|max:255',
            'packages.*.Name' => 'required|string|max:255',
        ]);

        $student->name = $request->input('name');
        $student->is_active = $request->input('is_active');
        $student->time_zone_id = $request->input('time_zone_id');
        $student->center = $request->input('center');

        $student->save();

        $packageIds = [];
        foreach ($request->input('packages') as $packageData) {
            $packageId = $packageData['Id'];
            $packageName = $packageData['Name'];

            $package = StudentPackage::updateOrCreate(
                ['student_id' => $student->id, 'package_id' => $packageId],
                ['package_name' => $packageName, 'is_active' => true]
            );

            // Mark other packages as inactive if they are not in the updated list
            $packageIds[] = $package->id;
        }

        // Deactivate packages that are not in the updated list
        StudentPackage::where('student_id', $student->id)
            ->whereNotIn('id', $packageIds)
            ->update(['is_active' => false]);

        return response()->json($student);
    } catch (ValidationException $e) {
        return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Student not found'], 404); // Custom error message for student not found
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to update student', 'error' => $e->getMessage()], 500);
    }
}

    
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        try {
            // Check if the student exists
            if (!$student) {
                throw new ModelNotFoundException('Student not found');
            }

            // Delete student and related packages
            $student->packages()->delete();
            $student->delete();

            return response()->json("Record deleted successfully", 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete student', 'error' => $e->getMessage()], 500);
        }
    }
}

