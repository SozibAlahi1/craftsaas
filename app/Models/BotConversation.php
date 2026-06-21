<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BotConversation extends Model
{
    protected $fillable = [
        'channel',
        'sender_id',
        'messages',
        'context',
        'last_message_at',
        'is_resolved',
    ];

    protected function casts(): array
    {
        return [
            'messages' => 'array',
            'context' => 'array',
            'last_message_at' => 'datetime',
            'is_resolved' => 'boolean',
        ];
    }
}
