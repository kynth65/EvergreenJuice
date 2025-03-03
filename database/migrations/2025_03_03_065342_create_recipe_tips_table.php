<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipe_tips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->text('tip_text');
            $table->integer('display_order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_tips');
    }
};