<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Recipe extends Model
{
    use HasFactory;
    
    protected $fillable = ['product_id', 'description'];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    public function ingredients()
    {
        return $this->hasMany(RecipeIngredient::class)->orderBy('display_order');
    }
    
    public function steps()
    {
        return $this->hasMany(RecipeStep::class)->orderBy('display_order');
    }
    
    public function tips()
    {
        return $this->hasMany(RecipeTip::class)->orderBy('display_order');
    }
    
    public function nutritionFacts()
    {
        return $this->hasMany(NutritionFact::class);
    }
}
