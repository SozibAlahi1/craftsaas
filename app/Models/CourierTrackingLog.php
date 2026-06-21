<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierTrackingLog extends Model
{
    protected $fillable = [
        'courier_shipment_id', 'status', 'location', 
        'remarks', 'tracked_at'
    ];

    protected function casts(): array
    {
        return [
            'tracked_at' => 'datetime',
        ];
    }

    public function shipment()
    {
        return $this->belongsTo(CourierShipment::class, 'courier_shipment_id');
    }
}
