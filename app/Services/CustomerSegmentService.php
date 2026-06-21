<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;

class CustomerSegmentService
{
    /**
     * Create or update customer from a new order.
     * Returns the customer.
     */
    public function syncFromOrder(Order $order): Customer
    {
        $customer = Customer::firstOrCreate(
            ['phone' => $order->phone],
            [
                'name' => $order->full_name,
                'address' => $order->address,
                'segment' => 'new'
            ]
        );

        // Update name and address to the latest ones
        $customer->name = $order->full_name;
        $customer->address = $order->address;
        $customer->last_order_at = $order->created_at;
        
        $customer->total_orders = $customer->orders()->count() + 1; // +1 since current order might not be linked yet if called before saving
        $customer->total_spent = $customer->orders()->sum('total') + $order->total;
        
        $customer->segment = $this->calculateSegment($customer->total_orders, $customer->total_spent);
        
        $customer->save();

        return $customer;
    }

    /**
     * Recalculate segments for all or specific customer
     */
    public function recalculateSegment(Customer $customer): void
    {
        $customer->total_orders = $customer->orders()->count();
        $customer->total_spent = $customer->orders()->sum('total');
        $customer->segment = $this->calculateSegment($customer->total_orders, $customer->total_spent);
        $customer->save();
    }

    protected function calculateSegment(int $ordersCount, float $totalSpent): string
    {
        if ($ordersCount >= 5 && $totalSpent >= 10000) {
            return 'vip';
        }
        
        if ($ordersCount >= 2) {
            return 'loyal';
        }

        return 'new';
    }
}
