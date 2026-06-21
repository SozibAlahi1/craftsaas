<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PixelEvent extends Model
{
    protected $fillable = [
        'pixel_id',
        'event_name',
        'payload',
        'status',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'sent_at' => 'datetime',
        ];
    }

    public function pixel()
    {
        return $this->belongsTo(Pixel::class);
    }
}
