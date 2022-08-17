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
        // $botman = BotManFactory::create($config, new LaravelCache());
        $botman = app('botman');

        $dialogFlow = DialogFlowV2::create()->listenForAction();
        // $botman->middleware->received(new ReceivedMiddleware());
        $botman->middleware->received($dialogFlow);

       
        // $botman->hears('weathersearch', function ($bot) {
        //     // $bot->reply('No is segs time!');
        //     $extras = $bot->getMessage()->getExtras();
        //     $apiReply = $extras['apiReply'];
        //     $bot->reply($apiReply);
        // })->middleware($dialogFlow);

        // $botman->hears('AgeSearch', function ($bot) {
        //     $bot->reply('my age is unknown!');
        //     // $bot->userStorage()->delete();
        // })->middleware($dialogFlow);

        // $botman->hears('help', function ($bot) {
        //     $bot->startConversation(new HelpConversation);
        //     // $bot->userStorage()->delete();
        // })->middleware($dialogFlow);

        // $botman->fallback(function ($bot) {
        //     $bot->reply(__('Sorry, I did not understand you. Please try again.'));
        // });

        // $botman->hears('Hello', function($bot) {
        //     $bot->startConversation(new InlineConversation);
        // });

        // $botman->hears('(.*)', function($bot) {
        //     $bot->reply($bot->getMessage()->getText());
        // });
        
        $botman->hears('(.*)', function ($bot) {
            $projectId = 'fyp-chatbot-jmea';
            $sessionId = $bot->getUser()->getId();
            // $sessionId = '123456';
            $languageCode = 'en-US';
            $msg = $bot->getMessage()->getText();
            $IntentController = new IntentController();

            $sessionID = session()->getId();

            app('App\Http\Controllers\SessionController')->createSession();
           

            $response = $IntentController->detect_intent_texts($projectId, $msg, $sessionId, $languageCode);

           
            $bot->reply($response);
        });

        $botman->listen();
    }

}



