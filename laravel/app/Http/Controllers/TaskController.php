<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $projectId = null;
        if ($request->has('project')) {
            $projectId = $request->input('project');
        }

        $tasks = [];

        switch ($projectId) {
            case "inbox":
                $tasks = Task::withSubtasks()->where('done', '=', false)->get();
                break;
            case "priority":
                $tasks = Task::withSubtasks()->where('priority', '!=', 0)->get();
                break;
            default:
                $tasks = Task::withSubtasks()->where('project_id', '=', $projectId)->get();
                break;
        }
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $task = new Task();
        $task->name = $request->name;
        $task->description = "";
        $task->project_id = $request->project_id;
        
        if ($request->parent_id) {
            $parentTask = Task::find($request->parent_id);
            $task->parent_id = $request->parent_id;
            $task->level = $parentTask->level + 1;
        }

        $task->save();

        return response()->json($task);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function toggleTask(Request $request)
    {
        $task = Task::withSubtasks()->find($request->route('taskId'));
        $task->done = (int)!$task->done;
        $task->save();

        $this->toggleSubtasks($task->subtasks, $task->done);
        return response()->json($task);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($taskId)
    {
        Task::find($taskId)->delete();

        return response()->json(['success' => 'task deleted']);
    }

    private function nestTasks($tasks, string $parentTaskId = null)
    {
        $nestedTasks = [];
        foreach ($tasks as $task) {
            if ($task->parentTask->id === $parentTaskId) {
                // error_log('task ID: ' . $task->id . ' // level: ' . $task->level);
                // error_log('parent Task ID: ' . ($task->parentTask-> id ?? "NULL"));
                // error_log('task name: ' . $task->name);
                $task->subtasks = $this->nestTasks($tasks, $task->id);
                $nestedTasks[] = $task;
            }
        }
        return $nestedTasks;
    }

    private function toggleSubtasks($tasks, bool $nextDoneState) {
        foreach ($tasks as $task) {
            $this->toggleSubtasks($task->subtasks, $nextDoneState);
            $task->done = $nextDoneState;
            error_log($task->done);
            error_log($task->id);
            $task->save();
        }
    }
}
