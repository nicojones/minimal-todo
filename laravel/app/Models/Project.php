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

    public $pivotTableUserId;

    public function users()
    {
        return $this
            ->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
            ->using(ProjectUser::class)
            ->withPivot('sort', 'show_completed', 'is_admin', 'color', 'icon')
            ->withTimestamps();
    }

    public function projectUsers()
    {
        return $this->hasMany(ProjectUser::class, 'project_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }

    public function getSharedAttribute()
    {
        return count($this->users) >= 2;
    }

    public function getShowCompletedAttribute()
    {
        $pivotTable = $this->userPivotTable();
        return $pivotTable ? $pivotTable->show_completed : false;
    }

    public function getIconAttribute()
    {
        $pivotTable = $this->userPivotTable();
        return $pivotTable ? $pivotTable->icon : ProjectIconEnum::CIRCLE;
    }

    public function getColorAttribute()
    {
        $pivotTable = $this->userPivotTable();
        return $pivotTable ? $pivotTable->color : null;
    }

    public function getSortAttribute()
    {
        $pivotTable = $this->userPivotTable();
        return $pivotTable ? $pivotTable->sort : ProjectSortEnum::OLDEST_FIRST;
    }

    public function delete()
    {

        $this->tasks()->each(function ($task) {
            $task->delete();
        });

        // delete the user
        return parent::delete();
    }

    private function userPivotTable()
    {
        return $this
            ->projectUsers()
            ->where("project_id", $this->id)
            ->where("user_id", Auth::id() ?? $this->pivotTableUserId)
            ->first();
    }
}
