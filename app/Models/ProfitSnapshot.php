<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfitSnapshot extends Model
{
    protected $fillable = [
        'order_id',
        'revenue',
        'product_cost',
        'courier_cost',
        'ad_spend',
        'gross_profit',
        'net_profit',
        'calculated_at',
    ];

    protected function casts(): array
    {
        return [
            'revenue' => 'float',
            'product_cost' => 'float',
            'courier_cost' => 'float',
            'ad_spend' => 'float',
            'gross_profit' => 'float',
            'net_profit' => 'float',
            'calculated_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
