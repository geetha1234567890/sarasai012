<?php

namespace Modules\Admin\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use Modules\Admin\Models\Batch;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $batches = Batch::with('parent')
                ->where('node_level', 3)
                ->get();

            $modifiedBatches = $batches->map(function($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'is_active' => $batch->is_active,
                    'created_at' => $batch->created_at,
                    'updated_at' => $batch->updated_at,
                    'branch' => [
                        'id' => $batch->parent->id,
                        'name' => $batch->parent->name
                    ]
                ];
            });

            return [
                'batches' => $modifiedBatches
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving batches:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to retrieve batches'], 500);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
                // $validatedData = Validator::make($request->all(), [
                //     'data' => 'required|array',
                //     'data.*.id' => 'required|integer',
                //     'data.*.name' => 'required|string|max:255',
                //     'data.*.parent_id' => 'nullable|exists:batches,id',
                //     'data.*.branch' => 'nullable|string|max:255',
                //     'data.*.is_active' => 'required|boolean',
                //     'data.*.child_batches' => 'nullable|array',
                // ])->validate();
                //  $batches = [];
                $validatedData = $request->validate([
                    'id'=>'required|numeric',
                    'name' => 'required|string|max:255',
                    'parent_id' => 'nullable|exists:batches,id',
                    'node_level'=>'required|integer',
                    'is_active' => 'required|boolean',
                ]);
                
                if(!Batch::find($validatedData['id'])){

                    $batch = new Batch();
                    $batch->id = $validatedData['id']; // Assuming 'id' is fillable in your Batch model
                    $batch->name = $validatedData['name'];
                    $batch->parent_id = $validatedData['parent_id'];
                    $batch->node_level = $validatedData['node_level'];
                    $batch->is_active = $validatedData['is_active'];

                    // Save the model instance to the database
                    $batch->save();
                    return response()->json($batch, 201);
                }

                return response()->json(['message' => 'Batch already exists with this ID'], 409); // Conflict 409

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Unexpected Error:', ['message' => $e->getMessage()]);
            return response()->json(['error message' => $e->getMessage()], 500);
        }
    }


    // protected function createBatch(array $batchData)
    // {
    //     try {
    //         $childBatches = $batchData['child_batches'] ?? [];
    //         unset($batchData['child_batches']);
            
    //         $batch = Batch::create($batchData);
            
    //         foreach ($childBatches as $childBatchData) {
    //             $childBatchData['parent_id'] = $batch->id;
    //             $this->createBatch($childBatchData);
    //         }
            
    //         return $batch->load('parent', 'children');
    //     } catch (\Exception $e) {
    //         Log::error('Error Creating Batch:', [
    //             'data' => $batchData,
    //             'message' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         throw $e;
    //     }
    // }


    /**
     * Display the specified batch.
     *
     * This function retrieves a batch along with its parent and children based on the given ID.
     * It handles possible exceptions and returns appropriate JSON responses.
     *
     * @param int $id The ID of the batch to retrieve.
     * @return \Illuminate\Http\JsonResponse A JSON response containing the batch data or an error message.
     */
    public function show($id)
    {
        try {
            // Attempt to retrieve the batch along with its parent and children using the provided ID
            $batch = Batch::with('parent')->find($id);

            if($batch){
                // If the batch is found, return it with a 200 OK status
                return response()->json($batch, 200);
            }

            // If the batch is not found, return a 404 Not Found status with an appropriate message
            return response()->json(['message' => 'Batch does not exist'], 404);     

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Batch not found', 'error' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve student', 'error' => $e->getMessage()], 500);
        }
    }


    /**
     * Retrieve batches by node level.
     *
     * This function fetches all batches from the database that have a specific node level
     * and returns them as a JSON response.
     *
     * @param int $node_level The level of the node to filter batches by.
     * @return \Illuminate\Http\JsonResponse A JSON response containing the batches.
     */
    // public function getBatcheByNodeLevel(Request $request)
    // {
    //     try {
    //         $batch_id = $request->batch_id;
    //         $node_level = $request->node_level;

    //         // Fetch batches from the database where the node_level matches the provided parameter
    //         $get_batch_by_node_level = Batch::with('parent', 'children')->where('node_level',$node_level)->orWhere('id',$batch_id)->get()->toArray();
           
    //         if(!empty($get_batch_by_node_level)){
    //             // Return the fetched batches as a JSON response
    //             return response()->json($get_batch_by_node_level, 200);
    //         }
    //         return response()->json(['message' => 'Batch does not exist'], 404);     

    //     } catch (ModelNotFoundException $e) {
    //         return response()->json(['message' => 'Batch not found', 'error' => $e->getMessage()], 404);
    //     } catch (\Exception $e) {
    //         return response()->json(['message' => 'Failed to retrieve student', 'error' => $e->getMessage()], 500);
    //     }
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('admin::edit');
    }


    /**
     * Update the specified batch.
     *
     * This function updates a batch based on the given ID and validated request data.
     * It handles possible exceptions and returns appropriate JSON responses.
     *
     * @param \Illuminate\Http\Request $request The request containing the update data.
     * @param int $id The ID of the batch to update.
     * @return \Illuminate\Http\JsonResponse A JSON response containing the updated batch data or an error message.
     */
    public function update(Request $request, $id)
    {
        try {
            // Attempt to find the batch by the given ID
            $batch = Batch::find($id);

            if($batch){
                // Validate the request data
                $validatedData = $request->validate([
                    'name' => 'required|string|max:255',
                    'parent_id' => 'nullable|exists:batches,id',
                    'node_level'=>'required|integer',
                    'is_active' => 'required|boolean',
                ]);
                
                // Update the batch with the validated data
                $batch->update($validatedData);

                // Return the updated batch data with a 200 OK status
                return response()->json($batch, 200);
            }

            // If the batch is not found, return a 404 Not Found status with an appropriate message
            return response()->json(['message' => 'Batch does not exist'], 404); 

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating batch:', ['message' => $e->getMessage()]);
            return response()->json(['Failed to update batch: error message =>' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $batch = Batch::findOrFail($id);
            $batch->delete();

            // return response()->json(null, 204);
            return response()->json("Record deleted successfully", 200);
        } catch (\Exception $e) {
            Log::error('Error deleting batch:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete batch'], 500);
        }
    }
}
