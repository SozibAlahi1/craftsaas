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
        Schema::table('pixels', function (Blueprint $table) {
            $table->text('access_token')->nullable()->change();
        });

        Schema::table('facebook_accounts', function (Blueprint $table) {
            $table->text('access_token')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pixels', function (Blueprint $table) {
            $table->string('access_token')->nullable()->change();
        });

        Schema::table('facebook_accounts', function (Blueprint $table) {
            $table->string('access_token')->change();
        });
    }
};
