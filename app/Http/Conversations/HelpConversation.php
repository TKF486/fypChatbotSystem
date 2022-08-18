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
       $category = app('App\Http\Controllers\CategoryController')->index();
       $categories = [];
       foreach($category as $row) {
        array_push($categories,$row->categoryName);
    }
    $this->createButtons($categories);
    //return $categories;
    }

    public function createButtons($categories){
        $buttons = [];
        foreach($categories as $row) {
            $temp_button = Button::create($row)->value($row);
            array_push($buttons,$temp_button);
          
        }

        //return $buttons;
        $this->askForDatabase($buttons);
       
    }

    public function askForDatabase($buttons)
    {
        $question = Question::create('Here are some of the questions that is frequently ask by students, you can start by choosing one of the options below?')->addButtons($buttons);

   
        $this->ask($question, function (Answer $answer) use ($question) {
            if ($answer->isInteractiveMessageReply()) {
                $category = $answer->getValue();
                if($category == 'category'){
                    $this->bot->reply('Awesome');
          
                }
                //$bot->reply(('Sorry, I did not understand you. Please try again.'));
            } else {
                $this->repeat($question);
                //console.log($answer->getValue());
            }
        });

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


