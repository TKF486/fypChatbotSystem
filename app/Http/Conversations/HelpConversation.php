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
    public function askForDatabase()
    {
        $question = Question::create('Here are some of the questions that is frequently ask by students, you can start by choosing one of the options below?')->addButtons([
            Button::create('Yes')->value('yes'),
            Button::create('No')->value('no'),
        ]);

   
        $this->ask($question, function (Answer $answer) use ($question) {
            if ($answer->isInteractiveMessageReply()) {
                $category = $answer->getValue();
                if($category == 'yes'){
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
        $this->askForDatabase();
    }
}


