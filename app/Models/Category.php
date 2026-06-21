<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'banner_image',
        'show_on_home',
    ];

    protected $casts = [
        'show_on_home' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function videoReels()
    {
        return $this->hasMany(VideoReel::class);
    }
}
