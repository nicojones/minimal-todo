<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('name');
            $table->string('description')->default('');
            $table->boolean('done')->default(0);
            $table->boolean('expanded')->default(0);
            $table->integer('level')->default(1);
            $table->integer('priority')->default(0);

            $table->timestamp('deadline')->nullable();
            $table->timestamp('alert')->nullable();
            $table->boolean('notify_me')->default(false);
            $table->boolean('email_me')->default(false);
            $table->boolean('starred')->default(false);
            $table->string('background_color')->nullable();
            $table->string('url')->nullable();

            $table->longText('notes')->nullable();

            // $table->uuid('parent_id');
            $table->uuid('parent_id')->nullable()->default(null);
            // $table->foreign('parent_id')
            //       ->references('id')
            //       ->on('tasks');

            $table->uuid('project_id')->default('');
            $table->foreign('project_id')
                  ->references('id')
                  ->on('projects')
                  ->onDelete('cascade');
        });

        // $dbh = DB::getPdo(); $dbh->query(
            // 'ALTER TABLE tasks ADD CONSTRAINT tasks_parent_id_foreign FOREIGN KEY (parent_id) REFERENCES tasks (id) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};
