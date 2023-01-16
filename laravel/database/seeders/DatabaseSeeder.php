<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \App\Models\Project;
use \App\Models\Task;
use \App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        
        $this->call([
            UserSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class, // level 1
            TaskSeeder::class, // level 2 maybe
            TaskSeeder::class, // level 2,3 maybe
            TaskSeeder::class, // level 2,3,4 maybe
            TaskSeeder::class, // level 2,3,4,5 maybe
            UserProjectSeeder::class,
        ]);
    }
}
