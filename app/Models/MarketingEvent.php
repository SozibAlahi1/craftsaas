<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingEvent extends Model
{
    protected $fillable = [
        'order_id',
        'platform',
        'event_name',
        'trigger_status',
        'event_id',
        'payload',
        'response',
        'sent',
        'sent_at',
        'retry_count',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'response' => 'array',
            'sent' => 'boolean',
            'sent_at' => 'datetime',
            'retry_count' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
