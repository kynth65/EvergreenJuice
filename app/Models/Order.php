<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'order_number', 
        'order_date', 
        'total_amount', 
        'payment_method', 
        'payment_amount', 
        'change_amount',
        'status'
    ];
    
    protected $casts = [
        'order_date' => 'datetime',
    ];
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}