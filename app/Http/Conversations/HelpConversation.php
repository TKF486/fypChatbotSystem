<?php

namespace App\Http\Conversations;
use Illuminate\Support\Facades\Log;
use BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Messages\Incoming;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Incoming\Answer;

use App\Http\Controllers\IntentController;

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
                    $this->bot->typesAndWaits(1);
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
           
            $projectId = 'fyp-chatbot-jmea';
            $sessionId = $this->bot->getUser()->getId();
            $languageCode = 'en-US';
            $msg = $this->bot->getMessage()->getText();
            $IntentController = new IntentController();

            $sessionID = session()->getId();

            app('App\Http\Controllers\SessionController')->createSession();
           

            $response = $IntentController->detect_intent_texts($projectId, $msg, $sessionId, $languageCode);
            //Log::debug($response);
            $this->bot->typesAndWaits(1);
            $this->bot->reply($response[1]);
         
        } else {
            $this->repeat($question);
            //console.log($answer->getValue());
        }
    });

}

    public function run()
    {
        // This will be called immediately
        $this->bot->typesAndWaits(1);
        $this->retrieveCategory();
    }
}


