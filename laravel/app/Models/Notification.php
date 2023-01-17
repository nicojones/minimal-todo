<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $guarded = [
        'title',
        'body',
        'read'
    ];

    public function task() {
        return $this->belongsTo(Task::class, 'task_id', 'id')->withDefault();
    }

}
