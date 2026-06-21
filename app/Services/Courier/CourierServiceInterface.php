<?php

namespace App\Services\Courier;

use App\Models\Order;

interface CourierServiceInterface
{
    /**
     * Get the name of the courier service.
     */
    public function getName(): string;

    /**
     * Create a consignment for the given order.
     * Should return an array with at least 'status' (200 for success), 'consignment_id', and 'tracking_code'.
     */
    public function createConsignment(Order $order): array;

    /**
     * Track a shipment by its tracking code.
     * Should return an array with at least 'status' (200 for success) and 'delivery_status'.
     */
    public function trackShipment(string $trackingCode): array;

    /**
     * Cancel a shipment.
     */
    public function cancelShipment(string $trackingCode): array;
}
