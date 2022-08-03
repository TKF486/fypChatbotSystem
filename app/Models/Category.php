<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;

class Category extends Model
{
    protected $fillable = ["categoryName", "noOfInteractions"];
    use HasFactory;

    public function questions(){
        return $this->hasMany(Question::class);
    }
}
