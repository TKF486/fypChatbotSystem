<?php

use Illuminate\Support\Facades\Route;
use App\Http\controllers\QuestionController;
use App\Http\controllers\HomeController;

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


Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('questions', [QuestionController::class, 'index']);
Route::get('logout', '\App\Http\Controllers\Auth\LoginController@logout');

Auth::routes();

Route::group(['middleware' => ['admin']], function () {
    Route::get('/', [HomeController::class, 'adminView'])->name('admin.view');
 });