<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'category_id',
        'price',
        'old_price',
        'discount_text',
        'image',
        'gallery',
        'description',
        'delivery_info',
        'delivery_dhaka',
        'delivery_outside',
        'return_info',
        'highlights',
        'variations',
        'color',
        'stock_quantity',
        'is_in_stock',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'highlights' => 'array',
            'variations' => 'array',
            'is_in_stock' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function videoReels()
    {
        return $this->hasMany(VideoReel::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
