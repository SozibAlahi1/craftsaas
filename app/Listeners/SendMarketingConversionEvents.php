<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Jobs\SendMarketingEventJob;
use App\Models\AnalyticsEvent;
use App\Models\MarketingEvent;
use App\Models\SiteSetting;
use App\Services\AnalyticsService;
use App\Services\Marketing\MarketingService;

class SendMarketingConversionEvents
{
    /**
     * Create the event listener.
     */
    public function __construct(protected MarketingService $marketingService) {}

    /**
     * Handle the event.
     */
    public function handle(OrderStatusChanged $event): void
    {
        $order = $event->order;
        $status = $order->status;

        // Get configured purchase trigger status from settings
        $trigger = SiteSetting::getValue('marketing_purchase_trigger', 'confirmed');

        if ($this->shouldTriggerPurchase($trigger, $status)) {
            $this->dispatchPurchaseEvent($order);
        }
    }

    /**
     * Determine if the purchase event should be triggered.
     */
    protected function shouldTriggerPurchase(string $trigger, string $status): bool
    {
        return match ($trigger) {
            'created' => $status === 'pending',
            'confirmed' => in_array($status, ['processing', 'confirmed']),
            'packed' => $status === 'packed',
            'shipped' => $status === 'shipped',
            'delivered' => $status === 'delivered',
            default => false,
        };
    }

    /**
     * Dispatch the purchase event to all registered platforms.
     */
    protected function dispatchPurchaseEvent(mixed $order): void
    {
        $providers = $this->marketingService->getProviders();

        foreach (array_keys($providers) as $platform) {
            // Duplicate protection: only send once per platform per order
            $exists = MarketingEvent::where('order_id', $order->id)
                ->where('platform', $platform)
                ->where('event_name', 'Purchase')
                ->exists();

            if ($exists) {
                continue;
            }

            // Prepare standard client-side identifiers if available in context
            $payload = [
                'event_name' => 'Purchase',
                'user_data' => [
                    'client_ip_address' => request()->ip(),
                    'client_user_agent' => request()->userAgent(),
                    'fbc' => request()->cookie('_fbc'),
                    'fbp' => request()->cookie('_fbp'),
                ],
                'custom_data' => [
                    'currency' => 'BDT',
                    'value' => $order->total,
                    'content_ids' => $order->items->pluck('product_id')->toArray(),
                    'content_type' => 'product',
                    'order_id' => $order->order_number,
                ],
            ];

            // Create event log entry
            $eventLog = MarketingEvent::create([
                'order_id' => $order->id,
                'platform' => $platform,
                'event_name' => 'Purchase',
                'trigger_status' => $order->status,
                'event_id' => 'order_'.$order->id.'_Purchase',
                'payload' => $payload,
                'sent' => false,
                'retry_count' => 0,
            ]);

            // Dispatch job to execute conversion asynchronously
            SendMarketingEventJob::dispatch($eventLog->id);
        }

        // Track internal analytics purchase
        $eventData = [
            'currency' => 'BDT',
            'value' => $order->total,
            'content_ids' => $order->items->pluck('product_id')->toArray(),
            'content_type' => 'product',
            'order_id' => $order->id,
        ];

        // Only track if not tracked before
        $analyticsExists = AnalyticsEvent::where('event_name', 'Purchase')
            ->where('properties->order_id', $order->id)
            ->exists();

        if (! $analyticsExists) {
            app(AnalyticsService::class)->track('Purchase', $eventData, $order->customer->user_id ?? null);
        }
    }
}
