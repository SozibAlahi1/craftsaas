<?php

namespace App\Services\Marketing\Providers;

use App\Models\Order;
use App\Services\Marketing\Contracts\MarketingProvider;

class GoogleAdsProvider implements MarketingProvider
{
    public function getName(): string
    {
        return 'google_ads';
    }

    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array
    {
        return ['status' => 'skipped', 'message' => 'Google Ads driver placeholder - event simulated successfully.'];
    }
}
