<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthenticationController::class)->group(function () {
    Route::post('/auth/login', 'login');
    Route::post('/auth/signup', 'register');
    Route::post('/auth/refresh', 'refresh')->middleware('auth');
    Route::post('/auth/logout', 'logout')->middleware('auth');
    // Route::post('/auth/forgot', 'doForgot');
});


Route::controller(ProjectController::class)->group(function () {
    Route::get('/projects', 'index');
    Route::post('/projects', 'create');
    Route::put('/projects', 'update');
    Route::delete('/projects/{projectId}', 'delete');
})->middleware('auth');

Route::controller(TaskController::class)->group(function () {
    Route::get('/tasks', 'index');
    Route::delete('/tasks/{taskId}', 'delete');
    Route::post('/tasks', 'create');
    Route::patch('/tasks/toggle/{taskId}', 'toggleTask');
    // Route::post('/auth/refresh', 'refresh');
    // Route::post('/auth/logout', 'logout');
    // Route::post('/auth/forgot', 'doForgot');
})->middleware('auth');

Route::get('/hello', function () {
    return User::all();
});