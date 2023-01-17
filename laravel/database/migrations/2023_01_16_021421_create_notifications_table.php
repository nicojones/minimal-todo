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
        Schema::create('notifications', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->timestamps();

            $table->string('title');
            $table->string('body');

            $table->boolean('read');

            $table->uuid('task_id');
            $table->foreign('task_id')
                  ->references('id')
                  ->on('tasks')
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
        Schema::dropIfExists('notifications');
    }
};
