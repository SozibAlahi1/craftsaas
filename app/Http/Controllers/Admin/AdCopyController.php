<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdCopy;
use App\Models\Product;
use App\Services\AdCopyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdCopyController extends Controller
{
    public function index()
    {
        $products = Product::select('id', 'name', 'price')->get();
        
        $copies = AdCopy::with('product:id,name')->latest()->paginate(20);

        return Inertia::render('admin/ad-copies/index', [
            'products' => $products,
            'copies' => $copies,
        ]);
    }

    public function generate(Request $request, AdCopyService $service)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'audience' => 'required|string|max:255',
            'tone' => 'required|string|in:formal,casual,urgent,emotional,humorous',
            'language' => 'required|string|in:en,bn',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        try {
            $content = $service->generate(
                $product,
                $validated['audience'],
                $validated['tone'],
                $validated['language']
            );

            AdCopy::create([
                'product_id' => $product->id,
                'tone' => $validated['tone'],
                'language' => $validated['language'],
                'content' => $content,
            ]);

            return redirect()->back()->with('success', 'Ad copy generated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(AdCopy $adCopy)
    {
        $adCopy->delete();
        return redirect()->back()->with('success', 'Ad copy deleted.');
    }
}
