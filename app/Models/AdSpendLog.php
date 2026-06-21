<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdSpendLog extends Model
{
    protected $fillable = [
        'campaign_id',
        'adset_id',
        'ad_id',
        'date',
        'spend',
        'impressions',
        'clicks',
        'reach',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'spend' => 'float',
            'impressions' => 'integer',
            'clicks' => 'integer',
            'reach' => 'integer',
        ];
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
