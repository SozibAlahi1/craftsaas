<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductCost;
use App\Models\ProductVariant;

class ProductCostService
{
    /**
     * Set the cost for a product.
     */
    public function setProductCost(Product $product, float $costPrice, string $effectiveFrom): void
    {
        ProductCost::create([
            'product_id' => $product->id,
            'cost_price' => $costPrice,
            'effective_from' => $effectiveFrom,
            'created_by' => auth()->id(),
        ]);

        $product->update(['cost_price' => $costPrice]);
    }

    /**
     * Set the cost for a specific product variant.
     */
    public function setVariantCost(ProductVariant $variant, float $costPrice, string $effectiveFrom): void
    {
        ProductCost::create([
            'product_id' => $variant->product_id,
            'variant_id' => $variant->id,
            'cost_price' => $costPrice,
            'effective_from' => $effectiveFrom,
            'created_by' => auth()->id(),
        ]);

        $variant->update(['cost_price' => $costPrice]);
    }

    /**
     * Get the historical cost for a product/variant at a specific date.
     */
    public function getHistoricalCost(int $productId, ?int $variantId = null, string $date = null): float
    {
        $date = $date ?? now()->toDateString();

        $query = ProductCost::where('product_id', $productId)
            ->where('effective_from', '<=', $date)
            ->orderByDesc('effective_from')
            ->orderByDesc('id');

        if ($variantId) {
            $cost = (clone $query)->where('variant_id', $variantId)->first();
            if ($cost) {
                return $cost->cost_price;
            }
        }

        $cost = $query->whereNull('variant_id')->first();
        return $cost ? $cost->cost_price : 0.0;
    }
}
