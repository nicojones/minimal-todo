<?php

namespace App\Http\Controllers;

use App\Enums\ProjectSortEnum;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

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

        error_log($this->getTime(86400));
        switch ($projectId) {
            case "today":
                $tasks = Task::topLevelWithSubtasks()
                    // ->whereDate('deadline', '>', $this->getTime())
                    ->whereDate('deadline', '<', $this->getTime(86400))
                    ->orderBy('deadline', 'asc')
                    ->get();
                break;
            case "upcoming":
                $tasks = Task::topLevelWithSubtasks()
                    ->whereDate('deadline', '>', $this->getTime())
                    ->orderBy('deadline', 'asc')
                    ->get();
                break;
            case "inbox":
                $tasks = Task::topLevelWithSubtasks()
                    ->where('done', '=', false)
                    ->orderBy('created_at', 'asc')
                    ->get();
                break;
            case "priority":
                $tasks = Task::withSubtasks()
                    ->where('priority', '!=', 0)
                    ->orderBy('priority', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->get();
                break;
            default:
                $tasks = Task::topLevelWithSubtasks()
                    // ->select(['*', DB::raw('IF(`deadline` IS NOT NULL, `deadline`, 99999999999) `deadline`')])
                    ->where('project_id', '=', $projectId)
                    ->orderBy(...$this->projectSort($projectId))
                    ->orderBy('created_at', 'asc')
                    ->get();
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|max:255',
            'url' => 'nullable|url',
        ]);

        $task = Task::find($request->id);
        $task->priority = $request->priority;
        $task->expanded = $request->expanded;

        $task->name = $request->name;
        $task->description = $request->description ?? "";
        $task->notes = $request->notes ?? "";
        $task->url = $request->url ?? "";

        $task->done = $request->done ?? false;
        $task->starred = $request->starred ?? false;

        $task->deadline = $request->deadline ? ($request->deadline / 1000) : null;
        $task->alert = $request->alert ? ($request->alert / 1000) : null;

        error_log($request->deadline);

        $task->background_color = $request->backgroundColor ?? "";

        error_log('tags: ' . implode(" ?? ", $request->tags));
        // preg_match_all("/(\#[a-zA-Z0-9]+)/", strtolower($request->tags), $matches);
        // $tags = $matches[0];
        // error_log('imploded: ' . implode(" || ", $tags));

        $tags = $request->tags;
        $tagIds = [];
        foreach ($tags as $tagName) {
            error_log("tag name --> " . $tagName);
            $tag = Tag::where('name', $tagName)->first();
            if (empty($tag)) {
                $tag = new Tag();
                $tag->name = $tagName;
                $tag->save();
            }
            $tagIds[] = $tag->id;
        }
        $task->tags()->sync($tagIds);

        $task->save();

        return response()->json($task);
    }

    public function searchTasks(Request $request)
    {
        $query = $request->input('q');
        $levDistance = 1;

        $tasks = Task::all()->filter(function ($task) use ($query, $levDistance) {
            return min(
                levenshtein($query, $task->name, 0, 1, 1),
                levenshtein($query, $task->description, 0, 1, 1)
            ) < $levDistance;
        })->toArray();

        // $tasks = Task::where('name', 'like', "%{$query}%")
        //     ->orWhere('description', 'like', "%{$query}%")
        //     ->get()
        //     ->toArray();

        return response()->json(array_values($tasks));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($taskId)
    {

        error_log("delete task");
        Task::find($taskId)->delete();

        return response()->json(['success' => 'task deleted']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteTasks($projectId)
    {
        error_log($projectId);
        Project::find($projectId)->tasks()->each(function ($task) {
            $task->delete();
        });

        return response()->json(['success' => 'all tasks deleted']);
    }

    // private function nestTasks($tasks, string $parentTaskId = null)
    // {
    //     $nestedTasks = [];
    //     foreach ($tasks as $task) {
    //         if ($task->parentTask->id === $parentTaskId) {
    //             // error_log('task ID: ' . $task->id . ' // level: ' . $task->level);
    //             // error_log('parent Task ID: ' . ($task->parentTask-> id ?? "NULL"));
    //             // error_log('task name: ' . $task->name);
    //             $task->subtasks = $this->nestTasks($tasks, $task->id);
    //             $nestedTasks[] = $task;
    //         }
    //     }
    //     return $nestedTasks;
    // }

    private function toggleSubtasks($tasks, bool $nextDoneState)
    {
        foreach ($tasks as $task) {
            $this->toggleSubtasks($task->subtasks, $nextDoneState);
            $task->done = $nextDoneState;
            error_log($task->done);
            error_log($task->id);
            $task->save();
        }
    }

    private function projectSort(string $projectId)
    {
        $userId = Auth::id();
        // error_log(Project::find($projectId));
        $sort = Project::find($projectId)
            ->users()
            ->newPivotStatement()
            ->where('user_id', $userId)
            ->where('project_id', $projectId)
            ->first()
            ->sort;

        $sortEnum = ProjectSortEnum::tryFrom($sort);

        switch ($sortEnum) {
            case ProjectSortEnum::A_TO_Z:
                return ['name', 'asc'];
            case ProjectSortEnum::Z_TO_A:
                return ['name', 'desc'];
            case ProjectSortEnum::PRIORITY:
                return ['priority', 'desc'];
            case ProjectSortEnum::NEWEST_FIRST:
                return ['created_at', 'desc'];
            case ProjectSortEnum::OLDEST_FIRST:
                return ['created_at', 'asc'];
            case ProjectSortEnum::DEADLINE:
                return [DB::raw('ISNULL(deadline), deadline'), 'asc'];
            default:
                return ['id', 'asc'];
        }
    }

    private function getTime(int $futureSeconds = 0)
    {
        return date('Y-m-d\TH:i:s.000000\Z', time() + $futureSeconds);
    }
}
