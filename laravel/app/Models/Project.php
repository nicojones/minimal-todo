<?php

namespace App\Models;

use App\Models\Scopes\UserProjectScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Project extends Model
{
    use HasFactory, HasUuids;

    protected $table = "projects";

    protected $fillable = [
        "name",
        "description"
    ];

    protected $guarded = [
        "user",
        "tasks",
        
        "icon",
        "color",
        // "secret"
    ];

    public function users() {
        return $this->belongsToMany(User::class, 'user_project', 'project_id', 'user_id')->withTimestamps();
    }
    
    public function tasks() {
        return $this->hasMany(Task::class, 'project_id');
    }

    public function delete()
    {

        $this->tasks()->each(function ($task) {
            error_log($task->id);
            $task->delete();
        });

        // delete the user
        return parent::delete();
    }
}