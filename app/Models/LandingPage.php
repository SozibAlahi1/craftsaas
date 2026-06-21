<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPage extends Model
{
    protected $fillable = ['business_id', 'title', 'slug', 'status', 'published_at', 'settings', 'meta'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'settings' => 'array',
            'meta' => 'array',
        ];
    }

    public function sections()
    {
        return $this->hasMany(LandingSection::class)->orderBy('sort_order');
    }
}
