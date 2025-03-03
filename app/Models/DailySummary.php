<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailySummary extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'summary_date', 
        'total_orders', 
        'total_items_sold', 
        'total_revenue'
    ];
    
    protected $casts = [
        'summary_date' => 'date',
    ];
}