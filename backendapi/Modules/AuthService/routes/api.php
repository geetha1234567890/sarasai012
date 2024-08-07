<?php

use Illuminate\Support\Facades\Route;
use Modules\AuthService\Http\Controllers\AuthServiceController;
use Modules\Admin\Http\Controllers\API\AuthController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('authservice', AuthServiceController::class)->names('authservice');
// });

// Route::prefix('v1')->group(function () {
//     Route::post('/login',[AuthController::class,'login']);
//     Route::middleware('auth:admin-api')->group(function () {
//         Route::post('/logout',[AuthController::class,'logout']);
//     });
// });
