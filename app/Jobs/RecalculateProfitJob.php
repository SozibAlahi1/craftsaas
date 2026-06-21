<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\ProfitService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecalculateProfitJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(ProfitService $profitService): void
    {
        // Recalculate profit for all completed/delivered orders
        Order::whereIn('status', ['delivered', 'confirmed', 'shipped'])
            ->chunk(100, function ($orders) use ($profitService) {
                foreach ($orders as $order) {
                    $profitService->calculateOrderProfit($order);
                }
            });
    }
}
