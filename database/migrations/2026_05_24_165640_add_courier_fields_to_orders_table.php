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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier_consignment_id')->nullable()->index()->after('total');
            $table->string('courier_tracking_code')->nullable()->index()->after('courier_consignment_id');
            $table->string('courier_status')->nullable()->after('courier_tracking_code');
            $table->text('courier_error')->nullable()->after('courier_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'courier_consignment_id',
                'courier_tracking_code',
                'courier_status',
                'courier_error',
            ]);
        });
    }
};
