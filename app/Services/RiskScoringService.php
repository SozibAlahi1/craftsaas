<?php

namespace App\Services;

use App\Models\BlockedCustomer;
use App\Models\Order;
use App\Models\RiskScore;

class RiskScoringService
{
    /**
     * Evaluate the risk of a given order.
     */
    public function evaluate(Order $order): RiskScore
    {
        $score = 0;
        $factors = [];

        // 1. Check if phone number is explicitly blocked
        $isBlocked = BlockedCustomer::where('phone', $order->phone)->exists();
        if ($isBlocked) {
            $score += 100;
            $factors[] = 'Phone number is on the blocklist.';
        }

        // 2. Check previous returned/cancelled orders from the same phone
        $pastOrders = Order::where('phone', $order->phone)->where('id', '!=', $order->id)->get();
        if ($pastOrders->count() > 0) {
            $cancelledCount = $pastOrders->where('status', 'cancelled')->count();
            $deliveredCount = $pastOrders->where('status', 'delivered')->count();

            if ($cancelledCount > 0) {
                // If they have more cancellations than deliveries, high risk
                if ($cancelledCount > $deliveredCount) {
                    $score += 50;
                    $factors[] = "High ratio of cancelled orders ($cancelledCount cancelled vs $deliveredCount delivered).";
                } else {
                    $score += 20;
                    $factors[] = "Customer has $cancelledCount previous cancelled order(s).";
                }
            }
            
            if ($deliveredCount > 0 && $cancelledCount === 0) {
                // Loyal customer, negative risk
                $score -= 10;
                $factors[] = "Customer has successful delivery history.";
            }
        }

        // 3. Fraud success ratio from Steadfast (if available from previous orders)
        // Usually, the Steadfast API fetches this asynchronously. If it's already set:
        if ($order->fraud_success_ratio !== null) {
            if ($order->fraud_success_ratio < 50) {
                $score += 40;
                $factors[] = "Courier network shows low success ratio (" . $order->fraud_success_ratio . "%).";
            } elseif ($order->fraud_success_ratio > 90) {
                $score -= 10;
                $factors[] = "Courier network shows high success ratio.";
            }
        }

        // Cap score between 0 and 100
        $score = max(0, min(100, $score));

        // Determine status
        $status = 'low';
        if ($score >= 75) {
            $status = 'high';
        } elseif ($score >= 40) {
            $status = 'medium';
        }

        // If score is 100 (e.g. blocked list), auto-cancel the order?
        // We will handle auto-cancellation logic here or outside. For now, just save score.
        $riskScore = RiskScore::updateOrCreate(
            ['order_id' => $order->id],
            [
                'score' => $score,
                'factors' => $factors,
                'status' => $status,
            ]
        );

        if ($status === 'high' && $isBlocked) {
            // Auto-cancel if explicitly blocked
            $order->update(['status' => 'cancelled']);
            $order->statusLogs()->create([
                'status' => 'cancelled',
                'changed_by' => null,
            ]);
            $order->notes()->create([
                'note' => 'Order automatically cancelled due to customer being on the blocklist.',
                'type' => 'internal',
                'user_id' => null,
            ]);
        }

        return $riskScore;
    }
}
