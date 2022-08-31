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

public function quesRetrieve($dispName){
    $string = "Could you elaborate more for me please? These are several topics based your question that I've found 👇.";
    $questions = app('App\Http\Controllers\QuestionController')->quesRetrieve_with_dispName($dispName);
    //$buttons = $this->createButtons($questions, $string);

    $buttons = [];
    foreach($questions as $row) {
        $temp_button = Button::create($row)->value($row);
        array_push($buttons,$temp_button);
      
    }
    return $buttons;


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
            $this->bot->reply($response);
         
        } else {
            $this->repeat($question);
            //console.log($answer->getValue());
        }
    });

}
    // public $displayName;

    // public function pre_run($dispName){
    //     //$this->$displayName = $this->dispName;
    //     $displayName = $dispName;
    //     Log::debug('pre_run() = '.$displayName);
    //     // $button =  $this->quesRetrieve($dispName);
    //     // Log::debug($button);
    //     // $this->askForQuestion($button);
    //     $this->run();
    // }

    public function run()
    {
        $button =  $this->quesRetrieve('test17');

        // This will be called immediately
        $this->askForQuestion($button);
        //$this->retrieveCategory();
        // Log::debug("run ()");
        //Log::debug($displayName);
       

    }
}


