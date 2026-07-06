<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the product archive/shop page.
     */
    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => Product::with('category')->get(),
            'initialCategory' => request('category', 'All'),
        ]);
    }

    /**
     * Display a single product page.
     */
    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->with([
                'reviews' => function ($query) {
                    $query->latest();
                },
                'variants.attributeValues.attribute',
            ])
            ->firstOrFail();

        $relatedProducts = Product::where('slug', '!=', $slug)
            ->with('category')
            ->take(5)
            ->get();

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Search products for AJAX.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', '%'.$query.'%')
            ->select('id', 'name', 'slug', 'price', 'old_price', 'image')
            ->take(5)
            ->get();

        return response()->json($products);
    }
}
