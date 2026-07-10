<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'nullable|integer',
            'product_variant_id' => 'nullable|integer',
            'slug' => 'required|string',
            'name' => 'required|string',
            'price' => 'required|string',
            'image' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
        ]);

        $cart = Session::get('cart', []);

        $itemId = $validated['slug'].'-'.($validated['color'] ?? '').'-'.($validated['size'] ?? '');

        if (isset($cart[$itemId])) {
            $cart[$itemId]['quantity'] += $validated['quantity'];
            $cart[$itemId]['product_id'] = $validated['product_id'] ?? ($cart[$itemId]['product_id'] ?? null);
            $cart[$itemId]['product_variant_id'] = $validated['product_variant_id'] ?? ($cart[$itemId]['product_variant_id'] ?? null);
        } else {
            $cart[$itemId] = [
                'product_id' => $validated['product_id'] ?? null,
                'product_variant_id' => $validated['product_variant_id'] ?? null,
                'slug' => $validated['slug'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'image' => $validated['image'],
                'quantity' => $validated['quantity'],
                'color' => $validated['color'] ?? null,
                'size' => $validated['size'] ?? null,
            ];
        }

        Session::put('cart', $cart);

        return back()->with('success', 'Item added to cart successfully!');
    }

    public function buyNow(Request $request)
    {
        $this->add($request);

        return redirect()->route('checkout.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Session::get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $validated['quantity'];
            Session::put('cart', $cart);
        }

        return back()->with('success', 'Cart updated.');
    }

    public function remove($id)
    {
        $cart = Session::get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            Session::put('cart', $cart);
        }

        return back()->with('success', 'Item removed from cart.');
    }
}
