<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tags';

    protected $fillable = [
        'name'
    ];


    public function tasks() {
        return $this->belongsToMany(Task::class, 'tag_task', 'tag_id', 'task_id')
            // ->using(ProjectUser::class)
            // ->withPivot()
            ->withTimestamps();
    }
}
