<?php

namespace App\Observers;

use App\Jobs\SendServerEventJob;
use App\Models\Order;
use App\Services\AnalyticsService;

class OrderEventObserver
{
    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('status')) {
            $userData = [
                'em' => $order->customer->email ?? null,
                'ph' => $order->phone,
                'fn' => hash('sha256', strtolower(trim(explode(' ', $order->full_name)[0] ?? ''))),
                'ln' => hash('sha256', strtolower(trim(explode(' ', $order->full_name)[1] ?? ''))),
            ];

            // Optional: You could fetch client IP/User agent if stored in Order or Session,
            // but usually this is tricky for server-side state changes unless stored at checkout.

            $eventData = [
                'currency' => 'BDT',
                'value' => $order->total,
                'content_ids' => $order->items->pluck('product_id')->toArray(),
                'content_type' => 'product',
                'order_id' => $order->order_number,
            ];

            // Generate a unique event ID for deduplication based on order ID and status
            $eventId = 'order_' . $order->id . '_' . $order->status;

            switch ($order->status) {
                case 'confirmed':
                    SendServerEventJob::dispatch('Purchase', $eventData, $userData, $eventId);
                    app(AnalyticsService::class)->track('Purchase', $eventData, $order->customer->user_id ?? null);
                    break;
                case 'shipped':
                    SendServerEventJob::dispatch('OrderShipped', $eventData, $userData, $eventId);
                    app(AnalyticsService::class)->track('OrderShipped', $eventData, $order->customer->user_id ?? null);
                    break;
                case 'delivered':
                    SendServerEventJob::dispatch('OrderDelivered', $eventData, $userData, $eventId);
                    app(AnalyticsService::class)->track('OrderDelivered', $eventData, $order->customer->user_id ?? null);
                    
                    // Calculate profit when order is finally delivered
                    app(\App\Services\ProfitService::class)->calculateOrderProfit($order);
                    break;
            }
        }
    }
}
