<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeIngredient extends Model
{
    use HasFactory;
    
    protected $fillable = ['recipe_id', 'ingredient_text', 'display_order'];
    
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}