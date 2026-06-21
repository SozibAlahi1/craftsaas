<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbandonedCart extends Model
{
    protected $fillable = [
        'session_id', 'customer_name', 'customer_phone',
        'customer_address', 'cart_data', 'last_active_at', 'status'
    ];

    protected function casts(): array
    {
        return [
            'cart_data' => 'array',
            'last_active_at' => 'datetime',
        ];
    }
}
