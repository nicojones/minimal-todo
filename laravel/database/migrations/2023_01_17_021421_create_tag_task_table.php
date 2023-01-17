<?php

use App\Enums\ProjectIconEnum;
use App\Enums\ProjectSortEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tag_task', function (Blueprint $table) {

            $table->timestamps();

            $table->uuid('task_id');
            $table->foreign('task_id')
                  ->references('id')
                  ->on('tasks')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->uuid('tag_id');
            $table->foreign('tag_id')
                  ->references('id')
                  ->on('tags')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tag_task');
    }
};
