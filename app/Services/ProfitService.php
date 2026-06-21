<?php

namespace App\Services;

use App\Models\AdSpendLog;
use App\Models\Order;
use App\Models\ProfitSnapshot;

class ProfitService
{
    public function __construct(private ProductCostService $productCostService) {}

    /**
     * Calculate and store profit snapshot for a given order.
     */
    public function calculateOrderProfit(Order $order): ProfitSnapshot
    {
        $orderDate = $order->created_at->toDateString();
        
        // 1. Revenue
        $revenue = $order->total;

        // 2. Product Cost (COGS)
        $productCost = 0;
        foreach ($order->items as $item) {
            $costPerUnit = $this->productCostService->getHistoricalCost(
                $item->product_id,
                $item->product_variant_id,
                $orderDate
            );
            $productCost += ($costPerUnit * $item->quantity);
        }

        // 3. Courier Cost
        $courierCost = $order->shipping; // Defaulting to what customer paid
        // If there's an actual CourierShipment model attached with exact cost, we'd use that here:
        // $courierCost = $order->shipment?->charge ?? $order->shipping;

        // 4. Gross Profit
        $grossProfit = $revenue - $productCost - $courierCost;

        // 5. Ad Spend Attribution
        $adSpend = $this->calculateAttributedAdSpend($orderDate);

        // 6. Net Profit
        $netProfit = $grossProfit - $adSpend;

        // Store snapshot
        return ProfitSnapshot::updateOrCreate(
            ['order_id' => $order->id],
            [
                'revenue' => $revenue,
                'product_cost' => $productCost,
                'courier_cost' => $courierCost,
                'ad_spend' => $adSpend,
                'gross_profit' => $grossProfit,
                'net_profit' => $netProfit,
                'calculated_at' => now(),
            ]
        );
    }

    /**
     * Calculate attributed ad spend for a single order on a specific date.
     * We distribute the day's total ad spend evenly across all orders that day.
     */
    private function calculateAttributedAdSpend(string $date): float
    {
        $totalSpend = AdSpendLog::where('date', $date)->sum('spend');
        
        if ($totalSpend == 0) {
            return 0.0;
        }

        $totalOrdersThatDay = Order::whereDate('created_at', $date)
            ->where('status', '!=', 'cancelled')
            ->count();

        if ($totalOrdersThatDay == 0) {
            return 0.0;
        }

        return $totalSpend / $totalOrdersThatDay;
    }
}
