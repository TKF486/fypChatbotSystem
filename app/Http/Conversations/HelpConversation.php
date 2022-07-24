<?php

namespace App\Http\Conversations;

use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

class HelpConversation extends Conversation
{
    public function askForDatabase()
    {
        $question = Question::create('Here are some of the questions that is frequently ask by students, you can start by choosing one of the options below?')
        ->fallback('Unable to create a new database')
        ->callbackId('create_database')
        ->addButtons([
            Button::create('Course Navigation')->value('yes'),
            Button::create('Course Syllabus')->value('no'),
            Button::create('Course Structure')->value('no'),
            Button::create('Technical Issues')->value('no'),
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


