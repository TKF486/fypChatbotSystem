<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Session;

class SessionController extends Controller
{
    public function store($sessionID){
        $session = new Session;
        $session->sessionID = $sessionID;
        $session->save();
        
    }

    public function checkSessionID($sessionID){
        $session = Session::where('sessionID', $sessionID)->first();
        if ($session === null) {
            $this->store($sessionID);
        }
    }

    public function createSession(){
        $sessionID = session()->getId();
        $this->checkSessionID($sessionID);

    }


}
