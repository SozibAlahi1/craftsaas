<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'ad_account_id',
        'campaign_id',
        'name',
        'status',
        'objective',
    ];

    public function adAccount()
    {
        return $this->belongsTo(AdAccount::class);
    }

    public function spendLogs()
    {
        return $this->hasMany(AdSpendLog::class);
    }
}
