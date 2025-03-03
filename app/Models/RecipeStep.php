<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeStep extends Model
{
    use HasFactory;
    
    protected $fillable = ['recipe_id', 'step_text', 'display_order'];
    
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}