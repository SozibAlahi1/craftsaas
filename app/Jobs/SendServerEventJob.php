<?php

namespace App\Jobs;

use App\Services\ServerEventService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendServerEventJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $eventName,
        public array $eventData,
        public array $userData,
        public ?string $eventId = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ServerEventService $serverEventService): void
    {
        $serverEventService->sendFacebookCAPI(
            $this->eventName,
            $this->eventData,
            $this->userData,
            $this->eventId
        );

        $serverEventService->sendTikTokEvent(
            $this->eventName,
            $this->eventData,
            $this->userData,
            $this->eventId
        );
    }
}
