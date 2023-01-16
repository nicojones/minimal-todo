<?php

namespace App\Models;

use App\Enums\ProjectIconEnum;
use App\Enums\ProjectSortEnum;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{

    protected $table = 'project_user';

    protected $keys = [
        'sort',
        'is_admin',
        'color'
    ];

    protected $hidden = [
        'updated_at',
        'user_id',
        'project_id'
    ];

    protected $casts = [
        'sort' => ProjectSortEnum::class,
        'show_completed' => 'boolean',
        'is_admin' => 'boolean',
        'icon' => ProjectIconEnum::class
    ];
}
