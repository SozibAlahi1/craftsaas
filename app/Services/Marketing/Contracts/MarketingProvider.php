<?php

namespace App\Services\Marketing\Contracts;

use App\Models\Order;

interface MarketingProvider
{
    public function getName(): string;

    /**
     * Send event to the provider API.
     * Must return the API response as an array.
     * Must throw an exception on failure/error.
     */
    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array;
}
