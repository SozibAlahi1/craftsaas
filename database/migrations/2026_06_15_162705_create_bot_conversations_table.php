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
        Schema::create('bot_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('channel'); // messenger, whatsapp
            $table->string('sender_id'); // fb psid or phone number
            $table->json('messages'); // json array of message history
            $table->json('context')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->boolean('is_resolved')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bot_conversations');
    }
};
