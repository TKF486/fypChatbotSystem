<?php

namespace App\Http\Controllers;
use App\Models\Question;
use App\Models\Category;

use Illuminate\Http\Request;
use Google\Cloud\Dialogflow\V2\Gapic;
use  Google\Cloud\Dialogflow\V2\Gapic\IntentsGapicClient;

use Google\ApiCore\ApiException;
use Google\ApiCore\CredentialsWrapper;
use Google\ApiCore\GapicClientTrait;

use Google\ApiCore\LongRunning\OperationsClient;
use Google\ApiCore\OperationResponse;
use Google\ApiCore\PathTemplate;
use Google\ApiCore\RequestParamsHeaderDescriptor;
use Google\ApiCore\RetrySettings;
use Google\ApiCore\Transport\TransportInterface;
use Google\ApiCore\ValidationException;
use Google\Auth\FetchAuthTokenInterface;
use Google\Cloud\Dialogflow\V2\BatchDeleteIntentsRequest;
use Google\Cloud\Dialogflow\V2\BatchUpdateIntentsRequest;
use Google\Cloud\Dialogflow\V2\BatchUpdateIntentsResponse;
use Google\Cloud\Dialogflow\V2\CreateIntentRequest;
use Google\Cloud\Dialogflow\V2\DeleteIntentRequest;
use Google\Cloud\Dialogflow\V2\GetIntentRequest;
use Google\Cloud\Dialogflow\V2\Intent;
use Google\Cloud\Dialogflow\V2\IntentBatch;
use Google\Cloud\Dialogflow\V2\ListIntentsRequest;
use Google\Cloud\Dialogflow\V2\ListIntentsResponse;
use Google\Cloud\Dialogflow\V2\UpdateIntentRequest;
use Google\LongRunning\Operation;
use Google\Protobuf\FieldMask;
use Google\Protobuf\GPBEmpty;

use Google\Protobuf\Struct;

use Google\Cloud\Dialogflow\V2\SessionsClient;
use Google\Cloud\Dialogflow\V2\TextInput;
use Google\Cloud\Dialogflow\V2\QueryInput;

use Google\Cloud\Dialogflow\V2\IntentsClient;

use Google\Cloud\Dialogflow\V2\Intent\TrainingPhrase\Part;
use Google\Cloud\Dialogflow\V2\Intent\TrainingPhrase;
use Google\Cloud\Dialogflow\V2\Intent\Message\Text;
use Google\Cloud\Dialogflow\V2\Intent\Message;

class IntentController extends Controller
{

function intent_create($projectId, $displayName, $trainingPhraseParts, $messageTexts)
{
    $intentsClient = new IntentsClient();

    // prepare parent
    $parent = $intentsClient->agentName($projectId);

    // prepare training phrases for intent
    $trainingPhrases = [];
    foreach ($trainingPhraseParts as $trainingPhrasePart) {
        $part = (new Part())
            ->setText($trainingPhrasePart);

        // create new training phrase for each provided part
        $trainingPhrase = (new TrainingPhrase())
            ->setParts([$part]);
        $trainingPhrases[] = $trainingPhrase;
    }

    // prepare messages for intent
    $text = (new Text())
        ->setText($messageTexts);
    $message = (new Message())
        ->setText($text);

    // prepare intent
    $intent = (new Intent())
        ->setDisplayName($displayName)
        ->setTrainingPhrases($trainingPhrases)
        ->setMessages([$message]);

    // create intent
    $response = $intentsClient->createIntent($parent, $intent);
    printf('Intent created: %s' . PHP_EOL, $response->getName());
   $intentFullPath = $response->getName();
   $intentID = basename($intentFullPath).PHP_EOL;
   $intentsClient->close();
   return $intentID;
}

function intent_delete($projectId = 'fyp-chatbot-jmea', $intentId)
{
    $intentsClient = new IntentsClient();
    $intentName = $intentsClient->intentName($projectId, $intentId);
    $intentsClient->deleteIntent($intentName);
    printf('Intent deleted: %s' . PHP_EOL, $intentName);
    $intentsClient->close();
}

function intent_update($displayName, $trainingPhraseParts, $messageTexts, $intentObject)
{
    $intentsClient = new IntentsClient();
    try {
        // prepare training phrases for intent
        $trainingPhrases = [];
        foreach ($trainingPhraseParts as $trainingPhrasePart) {
            $part = (new Part())
                ->setText($trainingPhrasePart);

            // create new training phrase for each provided part
            $trainingPhrase = (new TrainingPhrase())
                ->setParts([$part]);
            $trainingPhrases[] = $trainingPhrase;
        }

         // prepare messages for intent
        $text = (new Text())
        ->setText($messageTexts);
        $message = (new Message())
        ->setText($text);

        // prepare intent
        $intent = $intentObject
        ->setDisplayName($displayName)
        ->setTrainingPhrases($trainingPhrases)
        ->setMessages([$message]);

        $response = $intentsClient->updateIntent($intent);
    } finally {
        $intentsClient->close();
    }
}

//     function detect_intent_texts($projectId = 'fyp-chatbot-jmea', $text = 'hi', $sessionId = '123456', $languageCode = 'en-US')
// {
//     // new session
//     $test = array('credentials' => 'F:/GITHUB/fypChatbotSystem/fyp-chatbot-jmea-6c7de335595c.json');
//     $sessionsClient = new SessionsClient($test);
//     $session = $sessionsClient->sessionName($projectId, $sessionId ?: uniqid());
//     printf('Session path: %s' . PHP_EOL, $session);

//     // create text input
//     $textInput = new TextInput();
//     $textInput->setText($text);
//     $textInput->setLanguageCode($languageCode);

//     // create query input
//     $queryInput = new QueryInput();
//     $queryInput->setText($textInput);

//     // get response and relevant info
//     $response = $sessionsClient->detectIntent($session, $queryInput);
//     $queryResult = $response->getQueryResult();
//     $queryText = $queryResult->getQueryText();
//     $intent = $queryResult->getIntent();
//     $displayName = $intent->getDisplayName();
//     $confidence = $queryResult->getIntentDetectionConfidence();
//     $fulfilmentText = $queryResult->getFulfillmentText();

//     // output relevant info
//     print(str_repeat("=", 20) . PHP_EOL);
//     printf('Query text: %s' . PHP_EOL, $queryText);
//     printf('Detected intent: %s (confidence: %f)' . PHP_EOL, $displayName,
//         $confidence);
//     print(PHP_EOL);
//     printf('Fulfilment text: %s' . PHP_EOL, $fulfilmentText);

//     $sessionsClient->close();
// }
// $projectId, $text , $sessionId , $languageCode
function detect_intent_texts($projectId, $text , $sessionId , $languageCode)
{
    // new session
    $test = array('credentials' => 'F:/GITHUB/fypChatbotSystem/fyp-chatbot-jmea-6c7de335595c.json');
    $sessionsClient = new SessionsClient($test);
    $session = $sessionsClient->sessionName($projectId, $sessionId ?: uniqid());
    // printf('Session path: %s' . PHP_EOL, $session);

    // create text input
    $textInput = new TextInput();
    $textInput->setText($text);
    $textInput->setLanguageCode($languageCode);

    // create query input
    $queryInput = new QueryInput();
    $queryInput->setText($textInput);

    // get response and relevant info
    $response = $sessionsClient->detectIntent($session, $queryInput);
    $queryResult = $response->getQueryResult();
    $queryText = $queryResult->getQueryText();
    $fulfilmentText = $queryResult->getFulfillmentText();
    $intent = $queryResult->getIntent();
    $displayName = $intent->getDisplayName();
    $this->intentTracking($displayName);
    $sessionsClient->close();
    return $fulfilmentText;
}

function intentTracking($displayName = "Gym.OpenTime"){
    $question = Question::where("intentName", $displayName);
    $noOfInteractions = $question->value("noOfInteractions");
    $categoryID = $question->value("category_id");
    $noOfInteractions += 1;
    $question->update(['noOfInteractions' => $noOfInteractions]);
    $this->categoryTracking($categoryID);
}

function categoryTracking($category_id){
    $category = Category::where("id", $category_id);
    $noOfInteractions = $category->value("noOfInteractions"); 
    $noOfInteractions += 1;
    $category->update(['noOfInteractions' => $noOfInteractions]);
}

}
