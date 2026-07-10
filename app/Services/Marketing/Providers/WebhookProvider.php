<?php

namespace App\Services\Marketing\Providers;

use App\Models\Order;
use App\Services\Marketing\Contracts\MarketingProvider;

class WebhookProvider implements MarketingProvider
{
    public function getName(): string
    {
        return 'webhook';
    }

    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array
    {
        return ['status' => 'skipped', 'message' => 'Custom Webhooks driver placeholder - event simulated successfully.'];
    }
}
