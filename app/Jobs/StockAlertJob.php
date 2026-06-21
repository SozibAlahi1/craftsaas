<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class StockAlertJob implements ShouldQueue
{
    use Queueable;

    public $product;
    public $variant;

    /**
     * Create a new job instance.
     */
    public function __construct($product, $variant = null)
    {
        $this->product = $product;
        $this->variant = $variant;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $message = "Low Stock Alert: {$this->product->name}";
        
        if ($this->variant) {
            $message .= " (Variant SKU: {$this->variant->sku}) is down to {$this->variant->stock_quantity} units.";
        } else {
            $message .= " is down to {$this->product->stock_quantity} units.";
        }

        // We log it. In a real app we might notify admins via email, Slack, etc.
        \Illuminate\Support\Facades\Log::warning($message);
    }
}
