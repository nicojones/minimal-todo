<?php

namespace Database\Seeders;

use App\Enums\ProjectIconEnum;
use App\Enums\ProjectSortEnum;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class ProjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $projects = Project::all();
        $users = User::all();

        foreach ($projects as $project) {
            $isAdmin = true;
            foreach ($users as $user) {
                if (fake()->boolean()) {
                    DB::table('project_user')->insert([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'is_admin' => $isAdmin,
                        'sort' => fake()->randomElement(ProjectSortEnum::strings()),
                        'color' => fake()->hexColor(),
                        'icon' => fake()->randomElement(ProjectIconEnum::strings())
                    ]);
                    $isAdmin = false;
                }
            }
        }
    }
}
