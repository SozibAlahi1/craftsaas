<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappCampaign extends Model
{
    protected $fillable = [
        'name',
        'template_name',
        'template_params',
        'audience_filter',
        'scheduled_at',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
    ];

    protected function casts(): array
    {
        return [
            'template_params' => 'array',
            'audience_filter' => 'array',
            'scheduled_at' => 'datetime',
        ];
    }

    public function logs()
    {
        return $this->hasMany(WhatsappLog::class);
    }
}
