<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Dialogflow2\DialogFlowV2;
use BotMan\BotMan\Cache\LaravelCache;
use BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Messages\Incoming;

use App\Http\Conversations\InlineConversation;
use App\Http\Conversations\HelpConversation;
use App\Http\Middleware\ReceivedMiddleware;

use App\Http\Controllers\IntentController;

$GlobalAction = "";

class BotManController extends Controller
{
    public function handle()
    {
        /** @var BotMan $botman */
        $config = [
            // Your driver-specific configuration
            // "telegram" => [
            //    "token" => "TOKEN"
            // ]
        ];
        $botman = BotManFactory::create($config, new LaravelCache());
        $botman = app('botman');

        $dialogFlow = DialogFlowV2::create()->listenForAction();

        $botman->middleware->received($dialogFlow);

        
        $botman->hears('(.*)', function ($bot) {
            $projectId = 'fyp-chatbot-jmea';
            $sessionId = '123456';
            $languageCode = 'en-US';
            $msg = $bot->getMessage()->getText();
            $IntentController = new IntentController();
            $response = $IntentController->detect_intent_texts($projectId, $msg, $sessionId, $languageCode);
            $bot->reply($response);
            
        });

        $botman->listen();
    }
    
}


