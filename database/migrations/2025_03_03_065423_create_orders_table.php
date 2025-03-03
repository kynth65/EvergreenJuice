<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 20)->unique();
            $table->dateTime('order_date');
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method', 50)->default('Cash');
            $table->decimal('payment_amount', 10, 2);
            $table->decimal('change_amount', 10, 2);
            $table->string('status', 20)->default('Completed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};