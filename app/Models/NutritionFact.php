<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionFact extends Model
{
    use HasFactory;
    
    protected $fillable = ['recipe_id', 'nutrient_name', 'nutrient_value'];
    
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}