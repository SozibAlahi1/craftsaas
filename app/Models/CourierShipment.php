<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierShipment extends Model
{
    protected $fillable = [
        'order_id', 'courier_name', 'consignment_id', 
        'tracking_code', 'status', 'response_json'
    ];

    protected function casts(): array
    {
        return [
            'response_json' => 'array',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function trackingLogs()
    {
        return $this->hasMany(CourierTrackingLog::class);
    }
}
