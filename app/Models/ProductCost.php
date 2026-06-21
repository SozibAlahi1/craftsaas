<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCost extends Model
{
    protected $fillable = [
        'product_id',
        'variant_id',
        'cost_price',
        'effective_from',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'cost_price' => 'float',
            'effective_from' => 'date',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
