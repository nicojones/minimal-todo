<?php

namespace App\Models;

use App\Enums\ProjectIconEnum;
use App\Enums\ProjectSortEnum;
use App\Models\Scopings\UserProjectScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Auth;

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
        "tasks"
    ];

    protected $appends = [
        'shared',
        'sort',
        'show_completed',
        'color',
        'icon'
    ];

    protected $hidden = [
        'projectUsers',
        'pivot',
        'users'
    ];


    public function users() {
        return $this
            ->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->using(ProjectUser::class)
            ->withPivot('sort', 'show_completed', 'is_admin', 'color', 'icon')
            ->withTimestamps();
    }

    public function projectUsers() {
        return $this->hasMany(ProjectUser::class, 'project_id');
    }
    
    public function tasks() {
        return $this->hasMany(Task::class, 'project_id');
    }

    public function getSharedAttribute() {
        return count($this->users) >= 2;
    }

    public function getShowCompletedAttribute() {
        return $this->pivot ? $this->pivot->show_completed : null;
    }

    public function getIconAttribute() {
        return $this->pivot ? $this->pivot->icon : ProjectIconEnum::CIRCLE;
    }
    
    public function getColorAttribute() {
        return $this->pivot ? $this->pivot->color : null;
    }

    public function getSortAttribute() {
        return $this->pivot ? $this->pivot->sort : null;
        
        // error_log($this->projectUsers);
        // if ($this->pivot) {
        //     return $this->pivot->sort;
        // } else {
        //     $user = Auth::user();
        //     foreach ($this->projectUsers as $pivot) {
        //         if ($pivot->user_id === $user->id) {
        //             return $pivot->sort;
        //         }
        //     }
        // }
    }

    public function delete()
    {

        $this->tasks()->each(function ($task) {
            $task->delete();
        });

        // delete the user
        return parent::delete();
    }
}