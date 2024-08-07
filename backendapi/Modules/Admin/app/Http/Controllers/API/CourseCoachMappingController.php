<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\Models\AdminUsers;
use Modules\Admin\Models\Course;
use Modules\Admin\Models\CourseCoachMapping;

class CourseCoachMappingController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'Coach_id' => 'required|exists:admin_users,id',
                'courses' => 'required|array',
                'courses.*.id' => 'required|string',
            ]);

            $coach = AdminUsers::find($request->Coach_id);
            $coachRole = $coach->roles;

            if (!$coachRole->contains('role_name', 'Coach')) {
                return response()->json(['error' => 'Only Coach can be assigned to a course'], 403);
            }

            foreach ($request->courses as $course) {
                $course = Course::find($course['id']);
                $course->coaches()->attach($request->Coach_id);
            }

            return response()->json(['message' => 'Course Coach Mapping created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating Course Coach Mapping'], 500);
        }

    }


    public function destroy(Request $request)
    {
        try {
            $request->validate([
                'Coach_id' => 'required|exists:admin_users,id',
                'courses' => 'required|array',
                'courses.*.id' => 'required|string',
            ]);

            $coach = AdminUsers::find($request->Coach_id);
            $coachRole = $coach->roles;

            if (!$coachRole->contains('role_name', 'Coach')) {
                return response()->json(['error' => 'Only Coach can be assigned to a course'], 403);
            }

            foreach ($request->courses as $course) {
                $course = Course::find($course['id']);
                $course->coaches()->detach($request->Coach_id);
            }

            return response()->json(['message' => 'Course Coach Mapping deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting Course Coach Mapping'], 500);
        }
    }

    public function showCoachesForCourse($course_id)
    {
        try {
            $course = Course::find($course_id);
            if($course == null) {
            return response()->json(['error' => 'Course not found'], 404);
            }

            $coaches = $course->coaches->toArray();

            unset($coaches['pivot']);
            unset($coaches['profile_picture']);

            return response()->json(['coaches' => $coaches], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching Course Coaches'], 500);
        }
    }

    public function showCoursesForCoach($Coach_id)
    {
        try {
            $coach = AdminUsers::find($Coach_id);
            if($coach == null) {
                return response()->json(['error' => 'Coach not found'], 404);
            }

            $coachRole = $coach->roles->toArray();

            if (!$coachRole->contains('role_name', 'Coach')) {
                return response()->json(['error' => 'Only Coach can be assigned to a course'], 403);
            }

            $courses = $coach->courses;

            return response()->json(['courses' => $courses], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching Coach Courses'], 500);
        }
    }

    public function getAllCoursesWithCoaches()
    {
        try {

            $courses = Course::with('coaches')
            ->get();

            return response()->json(['courses' => $courses], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching Courses'], 500);
        }
    }

    public function getAllCoachesWithCourses()
    {
        try {

            $coaches = AdminUsers::whereHas('roles', function($q){
                $q->where('role_name', 'Coach');
            })->with(['courses' => function ($query) {
                $query->select('id', 'name');
            }])->get(['id', 'name']);

            return response()->json(['coaches' => $coaches], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
}
