<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Daily Summaries Migration
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_summaries', function (Blueprint $table) {
            $table->id();
            $table->date('summary_date')->unique();
            $table->integer('total_orders')->default(0);
            $table->integer('total_items_sold')->default(0);
            $table->decimal('total_revenue', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_summaries');
    }
};