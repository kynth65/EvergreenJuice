<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeTip extends Model
{
    use HasFactory;
    
    protected $fillable = ['recipe_id', 'tip_text', 'display_order'];
    
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}