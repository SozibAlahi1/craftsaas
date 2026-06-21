<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pixel extends Model
{
    protected $fillable = [
        'name',
        'pixel_id',
        'access_token',
        'is_active',
        'test_event_code',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'access_token' => 'encrypted',
        ];
    }
}
