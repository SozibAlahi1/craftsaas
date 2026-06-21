<?php

namespace App\Jobs;

use App\Models\WhatsappCampaign;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsAppCampaignJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 1200; // 20 mins

    protected WhatsappCampaign $campaign;

    public function __construct(WhatsappCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    public function handle(WhatsAppService $whatsappService): void
    {
        if ($this->campaign->status !== 'sending') {
            return;
        }

        $logs = $this->campaign->logs()->where('status', 'pending')->get();
        $rateLimitTracker = 0;

        foreach ($logs as $log) {
            // Respect rate limiting: 80 messages per second per Meta docs, but let's be safe
            if ($rateLimitTracker >= 50) {
                sleep(1);
                $rateLimitTracker = 0;
            }

            $result = $whatsappService->sendTemplate(
                $log->phone, 
                $this->campaign->template_name, 
                'en', 
                $this->campaign->template_params ?? []
            );

            if ($result['success']) {
                $log->update(['status' => 'sent', 'sent_at' => now(), 'message_id' => $result['response']['messages'][0]['id'] ?? null]);
                $this->campaign->increment('sent_count');
            } else {
                $log->update(['status' => 'failed']);
                $this->campaign->increment('failed_count');
            }

            $rateLimitTracker++;
        }

        $this->campaign->update(['status' => 'sent']);
    }
}
