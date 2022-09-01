<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Dialogflow2\DialogFlowV2;
use BotMan\BotMan\Cache\LaravelCache;
use BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Messages\Incoming;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;

use App\Http\Conversations\InlineConversation;
use App\Http\Conversations\HelpConversation;
use App\Http\Conversations\AlternateConversation;
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
        $botman = app('botman');

        $dialogFlow = DialogFlowV2::create()->listenForAction();

        $botman->middleware->received($dialogFlow);

    
        
        $botman->hears('(.*)', function ($bot) {
            $projectId = 'fyp-chatbot-jmea';
            $sessionId = $bot->getUser()->getId();
            $languageCode = 'en-US';
            $msg = $bot->getMessage()->getText();
            $IntentController = new IntentController();
            $sessionID = session()->getId();
            $help = new HelpConversation();
            if($msg == 'help'){
                $bot->startConversation($help);
            }
            else{
                app('App\Http\Controllers\SessionController')->createSession();
               
    
                $response = $IntentController->detect_intent_texts($projectId, $msg, $sessionId, $languageCode);
                // if($response != null){
                //     $bot->reply($response);
                // }
                $confidence = $response[0];
                $fulfilmentText = $response[1];
                $displayName = $response[2];

                if($confidence > 0.7){
                    $bot->typesAndWaits(1);
                    $bot->reply($fulfilmentText);
                }

                else{
                    Log::debug('Conf level is '. $confidence);
                    // Log::debug( $displayName);
                    try{
                        $Alter = new AlternateConversation();
                        $Alter->pre_run($displayName);
                        $bot->typesAndWaits(1);
                        $bot->startConversation($Alter);
                        // $bot->startConversation($Alter->pre_run($displayName));
                    }catch(Exception $e){

                    }
                    
                    // $bot->startConversation($Alter);
                    // Log::debug($response);
                }
            }
        

        });

        $botman->listen();
    }

}



