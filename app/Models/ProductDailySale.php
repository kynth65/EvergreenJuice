<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDailySale extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'summary_date', 
        'product_id', 
        'quantity_sold', 
        'revenue'
    ];
    
    protected $casts = [
        'summary_date' => 'date',
    ];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}