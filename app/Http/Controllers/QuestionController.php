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
