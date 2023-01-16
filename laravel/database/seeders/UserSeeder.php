<?php

namespace Database\Seeders;

use App\Models\User;
use DateTime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->select('*')->delete();

        DB::table('users')->insert([
            'id' => '00000000-ac96-41ea-b594-e8e2c6ebee5f',
            'name' => 'Nico',
            'email' => 'nico@kupfer.es',
            'password' => bcrypt('abcdef') // Hash::make('abcdef'),
        ]);

        User::factory()->count(2)->create();
    }
}
