<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        // Load products with their category to display
        $products = Product::with(['category', 'variants.attributeValues.attribute'])->latest()->get();

        return Inertia::render('admin/stocks/index', [
            'products' => $products,
        ]);
    }

    public function update(Request $request, Product $product, \App\Services\InventoryService $inventoryService)
    {
        $validated = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $diff = $validated['stock_quantity'] - $product->stock_quantity;
        
        if ($diff !== 0) {
            $inventoryService->adjustStock(
                $product->id,
                null, // No variant here
                $diff,
                'manual',
                null,
                auth()->id(),
                'Admin manual adjustment'
            );
        }

        return redirect()->back()->with('success', 'Stock updated successfully.');
    }

    public function updateVariant(Request $request, \App\Models\ProductVariant $variant, \App\Services\InventoryService $inventoryService)
    {
        $validated = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $diff = $validated['stock_quantity'] - $variant->stock_quantity;

        if ($diff !== 0) {
            $inventoryService->adjustStock(
                $variant->product_id,
                $variant->id,
                $diff,
                'manual',
                null,
                auth()->id(),
                'Admin manual variant adjustment'
            );
        }

        return redirect()->back()->with('success', 'Variant stock updated successfully.');
    }
}
