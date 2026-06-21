<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingTemplate extends Model
{
    protected $fillable = ['name', 'thumbnail', 'sections', 'category'];

    protected function casts(): array
    {
        return [
            'sections' => 'array',
        ];
    }
}
