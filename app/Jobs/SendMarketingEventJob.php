<?php

namespace App\Jobs;

use App\Models\MarketingEvent;
use App\Services\Marketing\MarketingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendMarketingEventJob implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 5;

    /**
     * Calculate the number of seconds to wait before retrying the job.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [5, 15, 30, 60, 120];
    }

    /**
     * Create a new job instance.
     */
    public function __construct(public int $marketingEventId) {}

    /**
     * Execute the job.
     */
    public function handle(MarketingService $marketingService): void
    {
        $eventLog = MarketingEvent::findOrFail($this->marketingEventId);

        // Duplicate protection: check if already sent
        if ($eventLog->sent) {
            return;
        }

        try {
            $response = $marketingService->send($eventLog);

            $eventLog->update([
                'response' => $response,
                'sent' => true,
                'sent_at' => now(),
            ]);
        } catch (\Exception $e) {
            $eventLog->increment('retry_count');
            $eventLog->update([
                'response' => array_merge($eventLog->response ?? [], ['error' => $e->getMessage()]),
            ]);

            Log::error("Marketing Event ID {$this->marketingEventId} failed on attempt {$eventLog->retry_count}: ".$e->getMessage());

            throw $e; // Rethrow to trigger automatic queue retry
        }
    }
}
