<?php

namespace App\Services\Marketing;

use App\Models\MarketingEvent;
use App\Services\Marketing\Contracts\MarketingProvider;

class MarketingService
{
    /**
     * @var MarketingProvider[]
     */
    protected array $providers = [];

    /**
     * Create a new MarketingService instance.
     *
     * @param  iterable<MarketingProvider>  $providers
     */
    public function __construct(iterable $providers)
    {
        foreach ($providers as $provider) {
            if ($provider instanceof MarketingProvider) {
                $this->providers[$provider->getName()] = $provider;
            }
        }
    }

    /**
     * Get all registered providers.
     *
     * @return array<string, MarketingProvider>
     */
    public function getProviders(): array
    {
        return $this->providers;
    }

    /**
     * Get a specific provider by name.
     */
    public function getProvider(string $name): ?MarketingProvider
    {
        return $this->providers[$name] ?? null;
    }

    /**
     * Send event data to the corresponding provider.
     *
     * @throws \Exception
     */
    public function send(MarketingEvent $event): array
    {
        $provider = $this->getProvider($event->platform);

        if (! $provider) {
            throw new \Exception("Marketing provider [{$event->platform}] is not registered.");
        }

        $order = $event->order;
        if (! $order) {
            throw new \Exception("Order not found for marketing event ID {$event->id}.");
        }

        // Prepare basic user data
        $userData = [
            'em' => $order->customer->email ?? null,
            'ph' => $order->phone,
            'fn' => hash('sha256', strtolower(trim(explode(' ', $order->full_name)[0] ?? ''))),
            'ln' => hash('sha256', strtolower(trim(explode(' ', $order->full_name)[1] ?? ''))),
        ];

        // Merge request IP / UA / Cookies passed in payload
        if (isset($event->payload['user_data'])) {
            $userData = array_merge($userData, $event->payload['user_data']);
        }

        // Prepare standard event data
        $eventData = [
            'currency' => 'BDT',
            'value' => $order->total,
            'content_ids' => $order->items->pluck('product_id')->toArray(),
            'content_type' => 'product',
            'order_id' => $order->order_number,
        ];

        if (isset($event->payload['custom_data'])) {
            $eventData = array_merge($eventData, $event->payload['custom_data']);
        }

        return $provider->sendEvent($event->event_name, $order, $eventData, $userData, $event->event_id);
    }
}
