<?php

namespace App\Http\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class InlineConversation extends Conversation
{
    public function askForDatabase()
    {
        $question = Question::create('Do you need a database?')
        ->fallback('Unable to create a new database')
        ->callbackId('create_database')
        ->addButtons([
            Button::create('Of course')->value('yes'),
            Button::create('Hell no!')->value('no'),
        ]);

    $this->ask($question, function ($answer) {
        // Detect if button was clicked:
        if ($answer->isInteractiveMessageReply()) {
            $selectedValue = $answer->getValue(); // will be either 'yes' or 'no'
            $selectedText = $answer->getText(); // will be either 'Of course' or 'Hell no!'
        }
    });
    }

    public function run()
    {
        // This will be called immediately
        $this->askForDatabase();
    }
}
