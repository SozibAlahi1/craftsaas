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
        Schema::table('products', function (Blueprint $table) {
            $table->text('delivery_info')->nullable()->after('description');
            $table->string('delivery_dhaka')->nullable()->after('delivery_info');
            $table->string('delivery_outside')->nullable()->after('delivery_dhaka');
            $table->text('return_info')->nullable()->after('delivery_outside');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['delivery_info', 'delivery_dhaka', 'delivery_outside', 'return_info']);
        });
    }
};
