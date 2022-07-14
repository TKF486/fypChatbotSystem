<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Dialogflow2\DialogFlowV2;

class BotManController extends Controller
{
    public function handle()
    {
        /** @var BotMan $botman */
        $botman = app('botman');

        $dialogFlow = DialogFlowV2::create()->listenForAction();
        $botman->middleware->received($dialogFlow);

        $botman->hears('weathersearch', function ($bot) {
            $bot->reply('No is segs time!');
        })->middleware($dialogFlow);

        $botman->hears('input.welcome', function ($bot) {
            $bot->reply('yo wasup!');
            // $bot->userStorage()->delete();
        })->middleware($dialogFlow);

        // $botman->fallback(function (BotMan $bot) {
        //     $bot->types();
        //     $bot->reply(__('Sorry, I did not understand you. Please try again.'));
        // });
        
        $botman->listen();
    }
}


