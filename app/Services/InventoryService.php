<?php

namespace App\Services;

use App\Jobs\StockAlertJob;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Adjust stock for a product or variant.
     *
     * @param  int  $quantity  (can be positive or negative)
     * @param  string  $type  ('manual', 'order', 'return', etc.)
     */
    public function adjustStock(
        int $productId,
        ?int $variantId,
        int $quantity,
        string $type,
        ?int $orderId = null,
        ?int $userId = null,
        ?string $notes = null
    ) {
        if ($quantity === 0) {
            return;
        }

        DB::transaction(function () use ($productId, $variantId, $quantity, $type, $orderId, $userId, $notes) {
            $product = Product::lockForUpdate()->findOrFail($productId);

            // Adjust product total stock
            $product->stock_quantity += $quantity;
            if ($product->stock_quantity <= 0) {
                $product->stock_quantity = 0;
                $product->is_in_stock = false;
            } else {
                $product->is_in_stock = true;
            }
            $product->save();

            // Adjust variant stock if applicable
            if ($variantId) {
                $variant = ProductVariant::lockForUpdate()->findOrFail($variantId);
                $variant->stock_quantity += $quantity;
                if ($variant->stock_quantity < 0) {
                    $variant->stock_quantity = 0;
                }
                $variant->save();
            }

            // Log movement
            StockMovement::create([
                'product_id' => $productId,
                'product_variant_id' => $variantId,
                'quantity' => $quantity,
                'type' => $type,
                'order_id' => $orderId,
                'user_id' => $userId,
                'notes' => $notes,
            ]);

            // Check for low stock alert
            $this->checkLowStock($product, $variantId ? $variant : null);
        });
    }

    /**
     * Check if product or variant is low on stock and dispatch alert.
     */
    protected function checkLowStock(Product $product, ?ProductVariant $variant)
    {
        $threshold = 5; // Configurable threshold

        if ($variant) {
            if ($variant->stock_quantity <= $threshold) {
                StockAlertJob::dispatch($product, $variant);
            }
        } else {
            if ($product->stock_quantity <= $threshold) {
                StockAlertJob::dispatch($product, null);
            }
        }
    }
}
