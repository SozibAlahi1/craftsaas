<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaign extends Model
{
    protected $fillable = [
        'name',
        'message_template',
        'audience_type',
        'audience_filter',
        'scheduled_at',
        'sent_at',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
    ];

    protected function casts(): array
    {
        return [
            'audience_filter' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function logs()
    {
        return $this->hasMany(SmsLog::class);
    }
}
