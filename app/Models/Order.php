<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'order_number',
        'full_name',
        'phone',
        'address',
        'payment_method',
        'status',
        'subtotal',
        'shipping',
        'total',
        'courier_consignment_id',
        'courier_tracking_code',
        'courier_status',
        'courier_error',
        'fraud_success_ratio',
        'landing_page_id',
    ];

    protected function casts(): array
    {
        return [
            'fraud_success_ratio' => 'float',
        ];
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function notes()
    {
        return $this->hasMany(OrderNote::class)->latest();
    }

    public function activities()
    {
        return $this->hasMany(OrderActivity::class)->latest();
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class)->latest();
    }

    public function callLogs()
    {
        return $this->hasMany(CallLog::class)->latest();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function riskScore()
    {
        return $this->hasOne(RiskScore::class);
    }

    public function landingPage()
    {
        return $this->belongsTo(LandingPage::class);
    }
}
