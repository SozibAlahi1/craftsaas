<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\SiteSetting;
use App\Services\Contracts\CallServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class OrderConfirmationCallJob implements ShouldQueue
{
    use Queueable;

    public $order;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(CallServiceInterface $callService): void
    {
        $isEnabled = SiteSetting::getValue('enable_ai_voice_confirmation', false);

        // Only call if enabled and order is pending
        if ($isEnabled && $this->order->status === 'pending') {
            $result = $callService->initiateCall($this->order);
            
            $this->order->callLogs()->create([
                'provider' => $result['provider'] ?? 'dummy',
                'call_id' => $result['call_id'] ?? null,
                'status' => $result['status'] ?? 'initiated',
            ]);
            
            $this->order->notes()->create([
                'note' => 'AI Voice Confirmation call initiated.',
                'type' => 'internal',
                'user_id' => null,
            ]);
        }
    }
}
