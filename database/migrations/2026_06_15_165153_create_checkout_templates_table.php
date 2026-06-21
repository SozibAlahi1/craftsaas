<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('checkout_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('layout', ['single_page', 'multi_step'])->default('single_page');
            $table->json('fields')->nullable();
            $table->json('styles')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkout_templates');
    }
};
