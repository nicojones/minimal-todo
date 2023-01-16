<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        $project->icon = "circle";
        $project->save();
        $project->users()->sync([Auth::user()->id], false);

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
        $project = Project::find($request->id);
        $project->name = $request->name;
        $project->color = $request->color;
        $project->icon = $request->icon;

        $project->save();

        return response()->json($project);
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($projectId)
    {
        
        Project::find($projectId)->delete();

        return response()->json(["success" => "deleted"]);
    }
    
}
