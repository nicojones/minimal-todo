<?php

namespace App\Models\Scopings;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;


class UserProjectScope implements Scope
{
  /**
   * Apply the scope to a given Eloquent query builder.
   *
   * @param  \Illuminate\Database\Eloquent\Builder  $builder
   * @param  \Illuminate\Database\Eloquent\Model  $model
   * @return void
   */
  public function apply(Builder $builder, Model $model)
  {
    $user = Auth::user();
    if ($user) {
      $projectIds = $user->projects->map(function ($project, $key) {
        return $project->id;
      });
      $builder->whereIn('project_id', $projectIds);
    }
  }
}
