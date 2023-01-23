<?php

use App\Functions\Functions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Mail\TaskNotificationMail;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

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

Route::controller(AuthenticationController::class)->group(function () {
    Route::post('/auth/login', 'login');
    Route::post('/auth/signup', 'register');
    Route::post('/auth/refresh', 'refresh')->middleware('auth');
    Route::post('/auth/logout', 'logout')->middleware('auth');
    // Route::post('/auth/forgot', 'doForgot');

    Route::get('/users/search', 'searchUsers');
});


Route::controller(ProjectController::class)->group(function () {
    Route::get('/projects', 'index');
    Route::post('/projects', 'create');
    Route::put('/projects', 'update');
    Route::delete('/projects/{projectId}', 'delete');

    Route::get('/projects/{projectId}/users', 'getProjectUsers');
    Route::post('/projects/{projectId}/join', 'addProjectUser');
    Route::delete('/projects/{projectId}/users', 'deleteProjectUser');
})->middleware('auth');

Route::controller(TaskController::class)->group(function () {
    Route::get('/tasks', 'index');
    Route::post('/tasks', 'create');
    Route::patch('/tasks/toggle/{taskId}', 'toggleTask');
    Route::patch('/tasks/toggle-expand/{taskId}', 'toggleExpandTask');
    Route::put('/tasks', 'update');
    Route::get('/tasks/search', 'searchTasks');
    Route::delete('/tasks/{taskId}', 'delete');
    Route::delete('/tasks/{projectId}/all-tasks', 'deleteTasks');
})->middleware('auth');

Route::get("/email", function () {
});