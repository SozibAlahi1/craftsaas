<?php

namespace App\Services\Marketing\Providers;

use App\Models\Order;
use App\Services\Marketing\Contracts\MarketingProvider;

class SnapchatProvider implements MarketingProvider
{
    public function getName(): string
    {
        return 'snapchat';
    }

    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array
    {
        return ['status' => 'skipped', 'message' => 'Snapchat driver placeholder - event simulated successfully.'];
    }
}
