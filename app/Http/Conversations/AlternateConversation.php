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

class AlternateConversation extends Conversation
{

public $dispName = '';

public function quesRetrieve($dispName){
    $string = "Could you elaborate more for me please? These are several topics based your question that I've found 👇.";
    $questions = app('App\Http\Controllers\QuestionController')->quesRetrieve_with_dispName($dispName);
    //$buttons = $this->createButtons($questions, $string);

    $buttons = [];
    foreach($questions as $row) {
        $temp_button = Button::create($row)->value($row);
        array_push($buttons,$temp_button);
      
    }

        $no_button = Button::create("I cant find my question")->value("null");
        array_push($buttons,$no_button);
    return $buttons;


}

public function askForQuestion($newBtn){
    $newQuestion = Question::create("Choose questions")->addButtons($newBtn);
    $this->ask($newQuestion, function (Answer $answer) use ($newQuestion) {
        if ($answer->isInteractiveMessageReply()) {
            $question = $answer->getValue();
            if($question == "null"){
                $this->bot->reply("I cant find my question");
                $this->bot->reply("Sorry it seems like i dont have an answer to your question");
            }   

            else{
                $this->bot->reply($question);
                $projectId = 'fyp-chatbot-jmea';
                $sessionId = $this->bot->getUser()->getId();
                $languageCode = 'en-US';
                $msg = $this->bot->getMessage()->getText();
                $IntentController = new IntentController();
    
                $sessionID = session()->getId();
    
                app('App\Http\Controllers\SessionController')->createSession();
               
    
                $response = $IntentController->detect_intent_texts($projectId, $msg, $sessionId, $languageCode);
                $this->bot->typesAndWaits(1);
                $this->bot->reply($response[1]);
            }
         
           
           
         
        } else {
            $this->repeat($newQuestion);
            //console.log($answer->getValue());
        }
    });

}
  
    public function pre_run($dispName){
        $this->dispName = $dispName;
    }

    public function run()
    {
        
        $button =  $this->quesRetrieve($this->dispName);
        $this->askForQuestion($button);
        //$this->retrieveCategory();
        // Log::debug("run ()");
        //Log::debug($displayName);
       

    }
}


