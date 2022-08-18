<?php

use Illuminate\Support\Facades\Route;
use App\Http\controllers\QuestionController;
use App\Http\controllers\HomeController;
use App\Http\controllers\BotManController;
use App\Http\controllers\IntentController;
use App\Http\controllers\CategoryController;
use App\Http\controllers\SessionController;
use App\Http\Conversations\HelpConversation;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('view');
});

Route::get('/view', function () {
    return view('view');
});

Route::get('/category', function () {
    return view('category');
});

Route::get('/dashboard', function () {
    return view('dashboard');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('questions', [QuestionController::class, 'index']);
Route::get('logout', '\App\Http\Controllers\Auth\LoginController@logout');
Route::match(['get', 'post'], '/botman', [BotManController::class, 'handle'])->name('botman');
Auth::routes();

Route::group(['middleware' => ['admin']], function () {
    Route::get('/', [HomeController::class, 'adminView'])->name('admin.view');
 });

Route::get('/test', [HelpConversation::class,'retrieveCategory']);
// Route::get('/dashboard', [SessionController::class,'checkSessionID']);
//  Route::get('/intent/projectID/{projectID}/text/{text}/sessionId/{sessionId}', [IntentController::class,'detect_intent_texts']);