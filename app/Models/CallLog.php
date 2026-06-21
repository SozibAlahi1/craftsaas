<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CallLog extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'call_id',
        'status',
        'duration',
        'recording_url',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
