<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use App\Models\AbandonedCart;
use Carbon\Carbon;

class AbandonedCartJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Delete carts that are older than 30 days and still pending
        $deleted = AbandonedCart::where('status', 'pending')
            ->where('last_active_at', '<', Carbon::now()->subDays(30))
            ->delete();

        // Find carts abandoned for more than 1 hour with a phone number
        $abandonedCartsWithPhone = AbandonedCart::where('status', 'pending')
            ->where('last_active_at', '<', Carbon::now()->subHours(1))
            ->whereNotNull('customer_phone')
            ->get();

        $leadsCreated = 0;
        foreach ($abandonedCartsWithPhone as $cart) {
            $phone = preg_replace('/[^\d\+]/', '', $cart->customer_phone);
            
            // Only create if it's a valid looking phone
            if (strlen($phone) >= 10) {
                $lead = \App\Models\Lead::firstOrCreate(
                    ['phone' => $phone],
                    [
                        'name' => $cart->customer_name,
                        'email' => $cart->customer_email,
                        'source' => 'abandoned_cart',
                        'status' => 'new',
                        'notes' => 'Auto-generated from abandoned cart session.',
                    ]
                );
                
                if ($lead->wasRecentlyCreated) {
                    $leadsCreated++;
                }
            }
        }

        Log::info("AbandonedCartJob run: Deleted {$deleted} old carts. Created {$leadsCreated} new leads from abandoned carts.");
    }
}
