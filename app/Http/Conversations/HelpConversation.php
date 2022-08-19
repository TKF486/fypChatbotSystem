<?php

namespace App\Http\Conversations;

use BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Messages\Incoming;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Incoming\Answer;

class HelpConversation extends Conversation
{

    public function retrieveCategory(){
        $string = 'Here are some of the categories that is frequently ask by students, you can start by choosing one of the options below?';
       $categories = app('App\Http\Controllers\CategoryController')->retrieveCategoryName();
       $this->createButtons($categories, $string);
    //return $categories;
    }

    public function createButtons($categories, $string){
        $buttons = [];
        foreach($categories as $row) {
            $temp_button = Button::create($row)->value($row);
            array_push($buttons,$temp_button);
          
        }

        //return $buttons;
        $categoryAsk = $this->askForCategory($buttons, $string);
        //$this->askForCategory($buttons, $string);
       
    }

    public function quesRetrieve($categoryAsk){
        $string = 'Here are some of the questions that is frequently ask by students, you can start by choosing one of the options below?';
        $questions = app('App\Http\Controllers\QuestionController')->quesRetrieve($categoryAsk);
        //$buttons = $this->createButtons($questions, $string);

        $buttons = [];
        foreach($questions as $row) {
            $temp_button = Button::create($row)->value($row);
            array_push($buttons,$temp_button);
          
        }

        return $buttons;


    }

    public function askForCategory($buttons, $string)
    {
        $question = Question::create($string)->addButtons($buttons);
        $category = null;
   
        $this->ask($question, function (Answer $answer) use ($question) {
            if ($answer->isInteractiveMessageReply()) {
                $category = $answer->getValue();
                if($category != null){
                    $this->bot->reply('You are currently asking about '. $category);
                    $newBtn = $this->quesRetrieve($category);
                    $this->askForQuestion($newBtn);
                }
                //$this->bot->reply('You are currently asking about'. $this->$category);
                // if( $category != null){
                //$newBtn = $this->quesRetrieve($category);
                //$this->askForQuestion($newBtn);
                //     $newQuestion = Question::create($string)->addButtons($newBtn);
                // }

             
            } else {
                $this->repeat($question);
                //console.log($answer->getValue());
            }
        });

        //return $category;
}


public function askForQuestion($newBtn){
    $newQuestion = Question::create("Choose questions")->addButtons($newBtn);
    $this->ask($newQuestion, function (Answer $answer) use ($newQuestion) {
        if ($answer->isInteractiveMessageReply()) {
            $question = $answer->getValue();
            $this->bot->reply($question);
         
        } else {
            $this->repeat($question);
            //console.log($answer->getValue());
        }
    });

}

    public function run()
    {
        // This will be called immediately
        $this->retrieveCategory();
    }
}


