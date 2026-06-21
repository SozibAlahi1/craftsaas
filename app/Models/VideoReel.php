<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoReel extends Model
{
    protected $fillable = [
        'category_id',
        'youtube_id',
        'title',
        'product_id',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
