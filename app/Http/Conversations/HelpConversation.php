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
        $categoryAsk = $this->askForDatabase($buttons, $string);
        //$this->askForDatabase($buttons, $string);
       
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

    public function askForDatabase($buttons, $string)
    {
        $question = Question::create($string)->addButtons($buttons);
        $category = null;
   
        $this->ask($question, function (Answer $answer) use ($question) {
            if ($answer->isInteractiveMessageReply()) {
                $category = $answer->getValue();



                if( $category != null){
                    $newBtn = $this->quesRetrieve($category);
                    $newQuestion = Question::create($string)->addButtons($newBtn);
                }



             
          

                    $this->ask($newQuestion, function (Answer $answer) use ($newQuestion) {
                        if ($answer->isInteractiveMessageReply()) {
                            $category = $answer->getValue();

                    
                        } else {
                            $this->repeat($question);
                            //console.log($answer->getValue());
                        }
                    })

             
            } else {
                $this->repeat($question);
                //console.log($answer->getValue());
            }
        });

        //return $category;

    // $this->ask($question, function (Answer $answer) use ($question) {
    //     // Detect if button was clicked:
    //     if ($answer->isInteractiveMessageReply()) {
    //         $selectedValue = $answer->getValue(); // will be either 'yes' or 'no'
    //     }

    // });
}

    public function run()
    {
        // This will be called immediately
        $this->retrieveCategory();
    }
}


