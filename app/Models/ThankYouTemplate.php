<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThankYouTemplate extends Model
{
    protected $fillable = ['name', 'content', 'pixel_events', 'is_default'];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'pixel_events' => 'array',
            'is_default' => 'boolean',
        ];
    }
}
