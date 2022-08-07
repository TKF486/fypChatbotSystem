<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(){
        return Category::all();
    }

    public function store(Request $req){
        return Category::create($req->all());
    }

    public function update(Request $req, $id){
        $category = Category::findOrFail($id);
        $category->update($req->all());
        return $category;
    }

    public function destroy($id){
        $category = Category::findOrFail($id);
        $category->delete();
        return 204;
    }
}
