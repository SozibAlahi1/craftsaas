<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedTile extends Model
{
    protected $fillable = [
        'title',
        'image',
        'link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
