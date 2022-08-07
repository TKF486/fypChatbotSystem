<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\controllers\QuestionController;
use App\Http\controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('questions', [QuestionController::class, 'index']);
Route::post('question', [QuestionController::class, 'store']);
Route::put('questionUpdate/{id}', [QuestionController::class, 'update']);
Route::delete('questionDelete/{id}', [QuestionController::class, 'destroy']);

Route::get('categories', [CategoryController::class, 'index']);
Route::post('category', [CategoryController::class, 'store']);
Route::put('categoryUpdate/{id}', [CategoryController::class, 'update']);
Route::delete('categoryDelete/{id}', [CategoryController::class, 'destroy']);