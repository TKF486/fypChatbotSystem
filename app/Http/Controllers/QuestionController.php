<?php

namespace App\Http\Controllers;
use App\Models\Question;
use App\Models\Session;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

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
        $question =  Question::where('noOfInteractions', '!=' , 0)->orderBy('noOfInteractions','DESC')->limit(10)->get();
        return $question;
    }

    public function quesRetrieve($categoryAsk){
       $categoryID = app('App\Http\Controllers\CategoryController')->getCategoryID($categoryAsk);
       $question = Question::where('category_id', $categoryID);
       //get Top5 question that is frequently asked
       $order = $question::where('noOfInteractions', '!=' , 0)->orderBy('noOfInteractions','DESC')->limit(5)->get();
       $questions = [];
       foreach($order as $row) {
        array_push($questions,$row->trainingPhrase1);
    }
    return $questions;
    }

    public function BulkImportQuestion(Request $request){
        $validator = Validator::make($request->all(), [
            'file' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator);
        }

        $file = $request->file('file');
        $csvData = file_get_contents($file);
        // dd($csvData);
        $rows = array_map("str_getcsv", explode("\n", $csvData));
        array_pop($rows);
        $header = array_shift($rows);

        foreach ($rows as $row) {
            $row = array_combine($header, $row);
            //handle mysql
            $projectId = 'fyp-chatbot-jmea';
            $displayName = $row['intentName'];
            $trainingPhraseParts = [$row['trainingPhrase1'],$row['trainingPhrase2'], $row['trainingPhrase3'],$row['trainingPhrase4']];
            $messageTexts = [$row['response']];   
            $intentID = app('App\Http\Controllers\IntentController')->intent_create($projectId, $displayName, $trainingPhraseParts, $messageTexts);

            Question::create([
                'intentName' => $row['intentName'],
                'intentID' => $intentID,
                'category_id' => $row['category_id'],
                'noOfInteractions' => $row['noOfInteractions'],
                'trainingPhrase1' => $row['trainingPhrase1'],
                'trainingPhrase2' => $row['trainingPhrase2'],
                'trainingPhrase3' => $row['trainingPhrase3'],
                'trainingPhrase4' => $row['trainingPhrase4'],
                'response' => $row['response'],
                
            ]);

        }

        return redirect('./');
    }
    
}

