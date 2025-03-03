<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id', 
        'name', 
        'price', 
        'image_path',
        'type'
    ];
    
    public function recipe()
    {
        return $this->hasOne(Recipe::class);
    }
    
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function dailySales()
    {
        return $this->hasMany(ProductDailySale::class);
    }
}