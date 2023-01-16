<?php

namespace App\Models;

use App\Models\Scopes\UserProjectScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Task extends Model
{
    use HasFactory, HasUuids;

    protected $table = "tasks";

    protected $fillable = [
        "name",
        "description"
    ];

    protected $guarded = [
        "project",
        "parentTask",
        "subtasks",
        
        "level",
        "done",
        "priority",
        "expanded"
    ];

    public function project() {
        return $this->belongsTo(Project::class, 'project_id', 'id')->withDefault();
    }

    public function subtasks() {
        // https://stackoverflow.com/a/27762080/2016686

        $subtasks = $this->hasMany(Task::class, 'parent_id');
        // foreach($subtasks as $subtask) {
        //     $subtask->parentTask = $this;
        // }
        return  $subtasks;
    }

    public function parentTask(){
        return $this->belongsTo(Task::class , 'parent_id', 'id')->withDefault();
    }

    protected static function booted()
    {
        static::addGlobalScope(new UserProjectScope);
    }

    public function delete() {
        $subtasks = Task::where('parent_id', $this->id);
        $subtasks->each(function ($subtask) {
            $subtask->delete();
        });
        parent::delete();
    }

    public function scopeWithSubtasks ($query) {
        $query->with(
            'subtasks', // 1 level
            'subtasks.subtasks', // 2 levels
            'subtasks.subtasks.subtasks', // 3 levels
            'subtasks.subtasks.subtasks.subtasks', // 4 levels
            'subtasks.subtasks.subtasks.subtasks.subtasks', // 5 levels
            'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 6 levels
            'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 7 levels
            'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 8 levels
            'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 9 levels
        );
    }

}
