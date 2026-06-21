<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::with('category')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/products/create', [
            'categories' => Category::all(['id', 'name']),
            'attributes' => \App\Models\ProductAttribute::with('values')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|string',
            'old_price' => 'nullable|string',
            'discount_text' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'description' => 'required|string',
            'delivery_info' => 'nullable|string',
            'delivery_dhaka' => 'nullable|string',
            'delivery_outside' => 'nullable|string',
            'return_info' => 'nullable|string',
            'highlights' => 'nullable|array',
            'highlights.*' => 'nullable|string',
            'color' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'is_in_stock' => 'boolean',
            'variations' => 'nullable|array',
            'variations.colors' => 'nullable|array',
            'variations.colors.*.label' => 'nullable|string',
            'variations.colors.*.image' => 'nullable|image|max:2048',
            'variations.sizes' => 'nullable|array',
            'variations.sizes.*.label' => 'nullable|string',
            'variations.sizes.*.image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Handle Primary Image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = Storage::disk('public')->url($path);
        }

        // Handle Gallery Images
        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products/gallery', 'public');
                $galleryPaths[] = Storage::disk('public')->url($path);
            }
        }
        $validated['gallery'] = $galleryPaths;

        // Filter out empty highlights
        $validated['highlights'] = array_filter($validated['highlights'] ?? []);

        // Also save original variations object for backward compatibility or simple UI needs
        $variations = $request->input('variations', ['colors' => [], 'sizes' => []]);
        $normalizedVariations = ['colors' => [], 'sizes' => []];
        foreach (['colors', 'sizes'] as $type) {
            foreach ($variations[$type] ?? [] as $index => $variation) {
                if (!empty(trim($variation['label'] ?? ''))) {
                    $normalizedVariations[$type][] = ['label' => trim($variation['label'])];
                }
            }
        }
        $validated['variations'] = $normalizedVariations;

        $product = Product::create($validated);

        if ($request->has('variant_matrix')) {
            foreach ($request->input('variant_matrix') as $variantData) {
                $variant = $product->variants()->create([
                    'sku' => $variantData['sku'] ?? null,
                    'price' => isset($variantData['price']) && $variantData['price'] !== '' ? (float) preg_replace('/[^0-9.]/', '', $variantData['price']) : null,
                    'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                ]);

                foreach ($variantData['attributes'] ?? [] as $attrName => $attrValue) {
                    $attribute = \App\Models\ProductAttribute::firstOrCreate(['name' => trim($attrName)]);
                    $value = $attribute->values()->firstOrCreate(['value' => trim($attrValue)]);
                    $variant->attributeValues()->attach($value->id);
                }
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load(['variants.attributeValues.attribute']);

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'attributes' => \App\Models\ProductAttribute::with('values')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|string',
            'old_price' => 'nullable|string',
            'discount_text' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'existing_gallery' => 'nullable|array',
            'description' => 'required|string',
            'delivery_info' => 'nullable|string',
            'delivery_dhaka' => 'nullable|string',
            'delivery_outside' => 'nullable|string',
            'return_info' => 'nullable|string',
            'highlights' => 'nullable|array',
            'highlights.*' => 'nullable|string',
            'color' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'is_in_stock' => 'boolean',
            'variations' => 'nullable|array',
            'variations.colors' => 'nullable|array',
            'variations.colors.*.label' => 'nullable|string',
            'variations.colors.*.image' => 'nullable|image|max:2048',
            'variations.sizes' => 'nullable|array',
            'variations.sizes.*.label' => 'nullable|string',
            'variations.sizes.*.image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = Storage::disk('public')->url($path);
        } else {
            unset($validated['image']);
        }

        $galleryPaths = $request->input('existing_gallery', []);

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products/gallery', 'public');
                $galleryPaths[] = Storage::disk('public')->url($path);
            }
        }
        $validated['gallery'] = array_values($galleryPaths);
        unset($validated['existing_gallery']);

        // Also save original variations object for backward compatibility or simple UI needs
        $variations = $request->input('variations', ['colors' => [], 'sizes' => []]);
        $normalizedVariations = ['colors' => [], 'sizes' => []];
        foreach (['colors', 'sizes'] as $type) {
            foreach ($variations[$type] ?? [] as $index => $variation) {
                if (!empty(trim($variation['label'] ?? ''))) {
                    $normalizedVariations[$type][] = ['label' => trim($variation['label'])];
                }
            }
        }
        $validated['variations'] = $normalizedVariations;

        // Filter out empty highlights
        $validated['highlights'] = array_filter($validated['highlights'] ?? []);

        $product->update($validated);

        if ($request->has('variant_matrix')) {
            // Re-sync variants
            // We can delete existing ones and recreate, or update existing. For simplicity, delete and recreate unless IDs are provided.
            // But since orders might link to variants, deleting variants is bad!
            // Let's update by ID or create new ones.
            $matrix = $request->input('variant_matrix');
            
            // Keep track of IDs we received to delete the missing ones
            $receivedVariantIds = [];

            foreach ($matrix as $variantData) {
                if (!empty($variantData['id'])) {
                    // Update existing
                    $variant = $product->variants()->find($variantData['id']);
                    if ($variant) {
                        $variant->update([
                            'sku' => $variantData['sku'] ?? null,
                            'price' => isset($variantData['price']) && $variantData['price'] !== '' ? (float) preg_replace('/[^0-9.]/', '', $variantData['price']) : null,
                            'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                        ]);
                        $receivedVariantIds[] = $variant->id;

                        // Sync attributes
                        $attrValueIds = [];
                        foreach ($variantData['attributes'] ?? [] as $attrName => $attrValue) {
                            $attribute = \App\Models\ProductAttribute::firstOrCreate(['name' => trim($attrName)]);
                            $value = $attribute->values()->firstOrCreate(['value' => trim($attrValue)]);
                            $attrValueIds[] = $value->id;
                        }
                        $variant->attributeValues()->sync($attrValueIds);
                    }
                } else {
                    // Create new
                    $variant = $product->variants()->create([
                        'sku' => $variantData['sku'] ?? null,
                        'price' => isset($variantData['price']) && $variantData['price'] !== '' ? (float) preg_replace('/[^0-9.]/', '', $variantData['price']) : null,
                        'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                    ]);
                    $receivedVariantIds[] = $variant->id;

                    $attrValueIds = [];
                    foreach ($variantData['attributes'] ?? [] as $attrName => $attrValue) {
                        $attribute = \App\Models\ProductAttribute::firstOrCreate(['name' => trim($attrName)]);
                        $value = $attribute->values()->firstOrCreate(['value' => trim($attrValue)]);
                        $attrValueIds[] = $value->id;
                    }
                    $variant->attributeValues()->sync($attrValueIds);
                }
            }

            // Delete removed variants
            $product->variants()->whereNotIn('id', $receivedVariantIds)->delete();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
