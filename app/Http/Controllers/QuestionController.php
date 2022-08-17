<?php

namespace App\Http\Controllers;
use App\Models\Question;

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


class QuestionController extends Controller
{

    public function index(){
        return Question::all();
    }

    public function store(Request $req){
        $projectId = 'fyp-chatbot-jmea';
        $input = $req->all();
        $displayName = $input['intentName'];
        $trainingPhraseParts = [$input['trainingPhrase1'],$input['trainingPhrase2'],$input['trainingPhrase3'],$input['trainingPhrase4']];
        $messageTexts = [$input['response']];
        $input['intentID'] = app('App\Http\Controllers\IntentController')->intent_create($projectId, $displayName, $trainingPhraseParts, $messageTexts);
        return Question::create($input);
    }

    public function update(Request $req, $id){
        $projectId = 'fyp-chatbot-jmea';
        $input = $req->all();
        $displayName = $input['intentName'];
        $trainingPhraseParts = [$input['trainingPhrase1'],$input['trainingPhrase2'],$input['trainingPhrase3'],$input['trainingPhrase4']];
        $messageTexts = [$input['response']];

        $question = Question::findOrFail($id);
        $intentID = $question['intentID'];   
        $intentsClient = new IntentsClient();
        try {
            $formattedName = $intentsClient->intentName($projectId, $intentID);
            $intentObject = $intentsClient->getIntent($formattedName);
        } finally {
            $intentsClient->close();
        }
        app('App\Http\Controllers\IntentController')->intent_update($displayName, $trainingPhraseParts, $messageTexts, $intentObject);
        $question->update($req->all());
        return $question;
    }

    public function destroy($id){
        $projectId = 'fyp-chatbot-jmea';
        $question = Question::findOrFail($id);
        $intentID = $question['intentID'];   
        app('App\Http\Controllers\IntentController')->intent_delete($projectId, $intentID);
        $question->delete();
        return 204;
    }

    public function quesFreq(){
        $question =  Question::orderBy('noOfInteractions','DESC')->limit(10)->get();
        return $question;
    }

    
}
