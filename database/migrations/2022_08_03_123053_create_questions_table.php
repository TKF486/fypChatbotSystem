<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->engine = "InnoDB";
            $table->id();
            $table->string('intentName');
            $table->string('intentID');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->integer('noOfInteractions')->default('0');
            $table->string('trainingPhrase1');
            $table->string('trainingPhrase2')->nullable();
            $table->string('trainingPhrase3')->nullable();
            $table->string('trainingPhrase4')->nullable();
            $table->string('response');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}