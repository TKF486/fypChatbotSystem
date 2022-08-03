<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Question extends Model
{
    protected $fillable = ["intentName", "intentID", "category_id", "noOfInteractions" ,"trainingPhrase1", "trainingPhrase2", "trainingPhrase3", "trainingPhrase4", "response"];
    use HasFactory;

    public function categories(){
        return $this->belongsTo(Category::class);
    }
}
