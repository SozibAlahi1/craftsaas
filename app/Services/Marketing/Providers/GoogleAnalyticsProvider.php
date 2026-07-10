<?php

namespace App\Services\Marketing\Providers;

use App\Models\Order;
use App\Services\Marketing\Contracts\MarketingProvider;

class GoogleAnalyticsProvider implements MarketingProvider
{
    public function getName(): string
    {
        return 'google_analytics';
    }

    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array
    {
        return ['status' => 'skipped', 'message' => 'Google Analytics 4 driver placeholder - event simulated successfully.'];
    }
}
