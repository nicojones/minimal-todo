<?php

namespace App\Models;

use App\Models\Scopings\UserProjectScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Task extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tasks';

    protected $fillable = [
        'name',
        'description',
        'notes'
    ];

    protected $guarded = [
        'project',
        'parentTask',
        'subtasks',

        'level',
        'done',
        'priority',
        'expanded',

        'deadline',
        'alert',
        'notify_me',
        'email_me',
        'starred',
        'background_color',
        'url',
        'notifications'
    ];

    protected $appends = [
        'icon',
        'dotColor',
        'tags'
    ];

    protected $hidden = [
        'project',
        'notifications'
    ];

    protected $casts = [
        'expanded' => 'boolean',
        'done' => 'boolean',
        'deadline' => 'datetime',
        'alert' => 'datetime',
        'starred' => 'boolean',
        'notify_me' => 'boolean',
        'email_me' => 'boolean'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'id')->withDefault();
    }

    public function subtasks()
    {
        // https://stackoverflow.com/a/27762080/2016686
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function tags()
    {
        return $this
            ->belongsToMany(Tag::class, 'tag_task', 'task_id', 'tag_id')
            ->withTimestamps();
    }

    public function getTagsAttribute() {
        return $this->tags()->get()->map(function ($tag) { return $tag->name; });
    }

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_id', 'id')->withDefault();
    }

    public function getIconAttribute()
    {
        return $this->project->icon;
    }

    public function getDotColorAttribute()
    {
        return $this->project->color;
    }


    protected static function booted()
    {
        static::addGlobalScope(new UserProjectScope);
    }

    public function delete()
    {
        $subtasks = Task::where('parent_id', $this->id);
        $subtasks->each(function ($subtask) {
            $subtask->delete();
        });

        $notifications = Notification::where('task_id', $this->id);
        $notifications->each(function ($notification) {
            $notification->delete();
        });

        $this->tags()->detach();

        parent::delete();
    }

    public function scopeWithSubtasks($query)
    {
        $query
            ->with(
                'subtasks', // 1 level
                'subtasks.subtasks', // 2 levels
                'subtasks.subtasks.subtasks', // 3 levels
                'subtasks.subtasks.subtasks.subtasks', // 4 levels
                'subtasks.subtasks.subtasks.subtasks.subtasks', // 5 levels
                'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 6 levels
                'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 7 levels
                'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 8 levels
                'subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks.subtasks', // 9 levels
            )
            ->orderBy('starred', 'desc');

        return $query;
    }

    public function scopeTopLevelWithSubtasks($query)
    {
        return $this->scopeWithSubtasks($query)->where('level', 1);
    }
}
