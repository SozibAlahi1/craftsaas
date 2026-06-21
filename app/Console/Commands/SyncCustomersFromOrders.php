<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncCustomersFromOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-customers-from-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync existing orders to customers';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\CustomerSegmentService $segmentService)
    {
        $this->info('Syncing customers from existing orders...');

        $orders = \App\Models\Order::whereNull('customer_id')->oldest()->get();
        $count = 0;

        foreach ($orders as $order) {
            $customer = $segmentService->syncFromOrder($order);
            $order->update(['customer_id' => $customer->id]);
            $count++;
        }

        // Recalculate segments properly to ensure accurate totals
        $customers = \App\Models\Customer::all();
        foreach ($customers as $customer) {
            $segmentService->recalculateSegment($customer);
        }

        $this->info("Synced {$count} orders to customers.");
    }
}
