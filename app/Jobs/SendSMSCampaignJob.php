<?php

namespace App\Jobs;

use App\Models\SmsCampaign;
use App\Models\SmsLog;
use App\Services\SMS\SMSServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendSMSCampaignJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 600; // 10 minutes

    protected SmsCampaign $campaign;

    public function __construct(SmsCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    public function handle(SMSServiceInterface $smsService): void
    {
        if ($this->campaign->status !== 'sending') {
            return;
        }

        $logs = $this->campaign->logs()->where('status', 'pending')->get();

        foreach ($logs as $log) {
            $result = $smsService->send($log->phone, $log->message);

            if ($result['success']) {
                $log->update(['status' => 'sent', 'sent_at' => now(), 'provider_response' => json_encode($result['response'])]);
                $this->campaign->increment('sent_count');
            } else {
                $log->update(['status' => 'failed', 'provider_response' => json_encode($result['response'])]);
                $this->campaign->increment('failed_count');
            }
        }

        $this->campaign->update(['status' => 'sent', 'sent_at' => now()]);
    }
}
