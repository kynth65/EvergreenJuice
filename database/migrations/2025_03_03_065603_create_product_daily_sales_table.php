<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_daily_sales', function (Blueprint $table) {
            $table->id();
            $table->date('summary_date');
            $table->string('product_id', 10);
            $table->integer('quantity_sold')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->timestamps();
            
            $table->unique(['summary_date', 'product_id']);
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_daily_sales');
    }
};