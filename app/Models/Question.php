<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ["intentName", "trainingPhrase1", "trainingPhrase2", "trainingPhrase3", "trainingPhrase4", "response"];
    use HasFactory;
}
