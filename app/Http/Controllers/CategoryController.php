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
    
    public function pieData(){
        $record = Category::all("categoryName","noOfInteractions");
        $data = [];
        foreach($record as $row) {
            $data['label'][] = $row->categoryName;
            $data['data'][] = $row->noOfInteractions;
        }
        return $data;
    }

    public function retrieveCategoryName(){
        //show only top 5 categories that is asked
        // $category = Category::orderBy('noOfInteractions','DESC')->limit(5)->get();
        $category = Category::orderBy('noOfInteractions','DESC')->get();
        $categories = [];
        foreach($category as $row) {
         array_push($categories,$row->categoryName);
     }
     return $categories;
     }

    //  public function getCategoryID($category){
    //     $category = Category::where('categoryName', $category)->get();
    //     $category->
    // }

    
    public function getCategoryID($categoryAsk){
        $category = Category::where('categoryName', $categoryAsk)->get();
        $id = [];
        foreach($category as $row) {
         array_push($id,$row->id);
     }
     return $id[0];
        //return $category->id;
    }

    public function retreiveID_Name(){

        $record = Category::all("id","categoryName");
        $data = [];
        foreach($record as $row) {
            $data[$row->id] = $row->categoryName;
        }
        return $data;
     }
}


