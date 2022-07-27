<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Dialogflow2\DialogFlowV2;
use BotMan\BotMan\Cache\LaravelCache;
use BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use App\Http\Conversations\InlineConversation;
use App\Http\Conversations\HelpConversation;

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

       
        $botman->hears('weathersearch', function ($bot) {
            // $bot->reply('No is segs time!');
            $extras = $bot->getMessage()->getExtras();
            $apiReply = $extras['apiReply'];
            $bot->reply($apiReply);
        })->middleware($dialogFlow);

        $botman->hears('AgeSearch', function ($bot) {
            $bot->reply('my age is unknown!');
            // $bot->userStorage()->delete();
        })->middleware($dialogFlow);

        $botman->hears('help', function ($bot) {
            $bot->startConversation(new HelpConversation);
            // $bot->userStorage()->delete();
        })->middleware($dialogFlow);

        $botman->fallback(function ($bot) {
            $bot->reply(__('Sorry, I did not understand you. Please try again.'));
        });

        $botman->hears('Hello', function($bot) {
            $bot->startConversation(new InlineConversation);
        });
        
        $botman->listen();
    }
    
}


