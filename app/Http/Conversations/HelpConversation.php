<?php

namespace App\Http\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Incoming\Answer;

class HelpConversation extends Conversation
{
    public function askForDatabase()
    {
        $question = Question::create('Choose one option')->addButtons([
            Button::create('Yes')->value('yes'),
            Button::create('No')->value('no'),
        ]);

    $this->ask($question, function (Answer $answer) {
        // Detect if button was clicked:
        if ($answer->getValue() === 'yes') {
            $bot->reply('No is segs time!');
        }
    });
    }

    public function run()
    {
        // This will be called immediately
        $this->askForDatabase();
    }
}


