<?php

namespace App\Http\Controllers;
use App\Models\Question;
use Illuminate\Http\Request;

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
        $input['intentID'] = dsadsads; 
        // $input['intentID'] = app('App\Http\Controllers\IntentController')->intent_create($projectId, $displayName, $trainingPhraseParts, $messageTexts);
        // app('App\Http\Controllers\IntentController')->intent_create($projectId, $displayName, $trainingPhraseParts, $messageTexts);
        return Question::create($req->all());
    }

    public function update(Request $req, $id){
        $question = Question::findOrFail($id);
        $question->update($req->all());
        return $question;
    }

    public function destroy($id){
        $question = Question::findOrFail($id);
        $question->delete();
        return 204;
    }
}
