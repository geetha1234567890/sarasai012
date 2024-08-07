<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Models\CourseStudentMapping;
use Modules\Admin\Models\Course;
use Modules\Admin\Models\Student;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CourseStudentMappingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllStudentWithCourse()
    {
        try {
            // Eager load the necessary relationships
            $CourseStudentMappings = CourseStudentMapping::with(['student', 'course'])->get();

            // Group the students with their Courses
            $students = $CourseStudentMappings->groupBy('student_id')->map(function ($studentGroup) {
                $student = $studentGroup->first()->student;
                return [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'enrollment_id' => $student->enrollment_id,
                    'packages' => $student->packages->map(function ($package) {
                            return [
                                'id' => $package->id,
                                'package_id' => $package->package_id,
                                'name' => $package->package_name,
                            ];
                    }),
                    'Courses' => $studentGroup->map(function ($studentCourse) {
                        $Course = $studentCourse->Course;
                        return [
                            'Course_id' => $Course->id,
                            'Course_name' => $Course->name,
                            'description' => $Course->description,
                            'start_date' => $Course->start_date,
                            'end_date' => $Course->end_date,
                            'time_zone_id' => $Course->time_zone_id,
                            'is_active' => $Course->is_active,
                        ];
                    }),
                    'is_active' => $student->is_active,
                ];
            })->values();

            return response()->json($students);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch students with courses', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getAllCoursesWithStudent(){
        try {
            // Eager load the necessary relationships
            $CourseStudentMappings = CourseStudentMapping::with(['student', 'course'])->get();

            // Group the Courses with their students
            $Courses = $CourseStudentMappings->groupBy('course_id')->map(function ($CourseGroup) {
                $Course = $CourseGroup->first()->Course;
                return [
                    'Course_id' => $Course->id,
                    'Course_name' => $Course->name,
                    'description' => $Course->description,
                    'start_date' => $Course->start_date,
                    'end_date' => $Course->end_date,
                    'time_zone_id' => $Course->time_zone_id,
                    'is_active' => $Course->is_active,
                    'students' => $CourseGroup->map(function ($CourseStudent) {
                        $student = $CourseStudent->student;
                        return [
                            'student_id' => $student->id,
                            'student_name' => $student->name,
                            'enrollment_id' => $student->enrollment_id,
                            'packages' => $student->packages->map(function ($package) {
                                    return [
                                        'id' => $package->id,
                                        'package_id' => $package->package_id,
                                        'name' => $package->package_name,
                                    ];
                            }),
                            'is_active' => $student->is_active,
                        ];
                    }),
                ];
            })->values();

            return response()->json($Courses);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch Courses with students', 'message' => $e->getMessage()], 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function getCoursesForStudent($studentId){
        try {
            $courses = CourseStudentMapping::where('student_id', $studentId)
            ->with('course')
            ->get()
            ->map(function ($mapping) {
                return [
                    'Course_id' => $mapping->course->id,
                    'Course_name' =>$mapping->course->name,
                    'description' =>$mapping->course->description,
                    'start_date' => $mapping->course->start_date,
                    'end_date' => $mapping->course->end_date,
                    'time_zone_id' => $mapping->course->time_zone_id,
                    'is_active' => $mapping->course->is_active
                ];
            });
            return response()->json($courses);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch courses', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStudentsInCourse($courseId){
        try {
            $students = CourseStudentMapping::where('course_id', $courseId)
                ->with('student.packages')
                ->get()
                ->map(function ($mapping) {
                    return [
                        'student_id' => $mapping->student->id,
                        'student_name' => $mapping->student->name,
                        'enrollment_id' => $mapping->student->enrollment_id,
                        'packages' => $mapping->student->packages->map(function ($package) {
                            return [
                                'id' => $package->id,
                                'package_id' => $package->package_id,
                                'name' => $package->package_name,
                            ];
                        }),
                        'is_active' => $mapping->student->is_active,
                    ];
                });

            return response()->json($students);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Course not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch students', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            
            $validatedData = $request->validate([
                'student_id' => 'required|exists:students,id',
                'course_id' => 'required|exists:courses,id',
            ]);

            if(!CourseStudentMapping::where('student_id',$validatedData['student_id'])->where('course_id',$validatedData['course_id'])->exists()){
                $mapping = CourseStudentMapping::create($validatedData);
                return response()->json(['mapping created Successfully'], 201);
            }
            return response()->json(['message' => 'Student already assign to this course'], 409); // Conflict 409
 
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create mapping', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($student_id, $course_id)
    {
        try {
            $mapping = CourseStudentMapping::where('student_id', $student_id)
                ->where('course_id', $course_id)
                ->firstOrFail();
            $mapping->delete();

            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mapping not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete mapping', 'message' => $e->getMessage()], 500);
        }
    }


    
}
