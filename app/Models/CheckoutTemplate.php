<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutTemplate extends Model
{
    protected $fillable = ['name', 'layout', 'fields', 'styles', 'is_default'];

    protected function casts(): array
    {
        return [
            'fields' => 'array',
            'styles' => 'array',
            'is_default' => 'boolean',
        ];
    }
}
