<?php

namespace App\Http\Controllers;

use App\Enums\ProjectIconEnum;
use App\Enums\ProjectIconEnumTypes;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule as ValidationRule;
use Symfony\Component\Console\Input\Input;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return Project
        $user = Auth::user();
        // return response()->json($user);
        $userProjects = $user->projects;
        return response()->json($userProjects);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {

        $project = new Project();
        $project->name = $request->name;
        $project->color = $this->randomHex();
        $project->icon = ProjectIconEnum::CIRCLE;
        $project->save();
        $project->users()->sync([Auth::user()->id], ['is_admin' => true]);

        return response()->json($project);
    }

    /**
     * Update a resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $project = Project::find($request->id);
        $project->name = $request->name;
        $project->color = $request->color;
        $project->icon = $request->icon;
        
        $project->users()->updateExistingPivot($user->id, [
            'sort' => $request->sort,
            'show_completed' => $request->show_completed
        ]);

        $project->save();

        return response()->json($project);
    } 
    
    public function getProjectUsers(string $projectId)
    {
        $users = Project::find($projectId)->users()->get();

        return response()->json($users);
    }

    public function addProjectUser(string $projectId, Request $request)
    {
        $userId = $request->input('id');

        Project::find($projectId)
            ->users()
            ->sync($userId, []);

        return response()->json($this->getProjectUsers($projectId));
    }

    public function deleteProjectUser(string $projectId, Request $request)
    {
        $userId = $request->input('id');

        // TODO --
        Project::find($projectId)
            ->users()
            ->newPivotStatement()
            ->where('user_id', $userId)
            ->where('project_id', $projectId) /* otherwise it deletes all projects from {@see $userId} */
            ->delete();

        return response()->json($this->getProjectUsers($projectId));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(string $projectId)
    {

        Project::find($projectId)->delete();

        return response()->json(["success" => "deleted"]);
    }
}
