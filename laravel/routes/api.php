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
    Route::put('/tasks', 'update');
    Route::get('/tasks/search', 'searchTasks');
    Route::delete('/tasks/{taskId}', 'delete');
    Route::delete('/tasks/{projectId}/all-tasks', 'deleteTasks');
})->middleware('auth');

Route::get("/email", function () {
    $fromHoursInAdvance = 0;
        $toHoursInAdvance = 24;
        $tasksWithDeadline = Task::whereNotNull('deadline')
            ->where('alert', true)
            ->where('deadline', '<', Functions::getFutureTime($toHoursInAdvance * 60 * 60))
            ->where('deadline', '>', Functions::getFutureTime($fromHoursInAdvance * 60 * 60))
            ->with('project.users')
            ->get();

        error_log(count($tasksWithDeadline));

        $taskDataByUser = [];
        foreach ($tasksWithDeadline as $task) {
            Log::info('TASK: ' . $task->project->users);
            $taskUsers = $task->project->users;
            foreach ($taskUsers as $user) {
                error_log('Task user: ' . $user->email);
                if (empty($taskDataByUser[$user->id])) {
                    $taskDataByUser[$user->id] = [
                        'user' => $user,
                        'tasks' => []
                    ];
                }

                error_log("unix " . $task->deadline->timestamp);
                $taskDataForUser = [
                    'task' => $task,
                    'deadline' => $task->deadline,
                    'project' => $task->project,
                    'hasOtherUsers' => count($task->project->users) > 1,
                    'users' => array_filter(
                        $task->project->users->toArray(),
                        function ($_user) use ($user) {
                            // error_log(join(' // ', $_user));
                            return $user->id 
                            !== $_user['id'];
                        }
                    )
                ];

                $taskDataByUser[$user->id]['tasks'][] = $taskDataForUser;
            }
        }

        error_log('potato');
        error_log('here: ' . json_encode($taskDataByUser));
        error_log('carrot');
        
        foreach ($taskDataByUser as $userId => $taskDataForUser) {
            $user = $taskDataForUser['user'];
            
            error_log('data: ' . json_encode($taskDataForUser));
            return new TaskNotificationMail($taskDataForUser);
            // Mail::to($user->email)->send(new TaskNotificationMail($taskDataForUser));
        }
});