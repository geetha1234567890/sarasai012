<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Modules\Admin\Models\Course;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $courses = Course::all();
            return response()->json($courses);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Failed to retrieve courses', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer|max:255',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'time_zone_id' => 'required|integer|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $course = new Course();
            $course->id = $request->id;
            $course->name = $request->name;
            $course->description = $request->description;
            $course->start_date = $request->start_date;
            $course->end_date = $request->end_date;
            $course->time_zone_id = $request->time_zone_id;
            $course->save();

            return response()->json($course, 201);
        
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Failed to create course', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $course = Course::findOrFail($id);
            return response()->json($course);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Failed to retrieve course', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'string|max:255',
                'description' => 'string',
                'start_date' => 'date',
                'end_date' => 'date|after_or_equal:start_date',
                'time_zone_id' => 'Integer',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $course = Course::findOrFail($id);
            $input = $request->all();
            $course->update($input);
            
            return response()->json($course);
        
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Failed to update course', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();
            return response()->json(null, 204);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['message' => 'Failed to delete course', 'error' => $th->getMessage()], 500);
        }
    }
}
