<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbandonedCart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbandonedCartController extends Controller
{
    /**
     * Display a listing of the abandoned carts.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $carts = AbandonedCart::where('status', $status)
            ->orderBy('last_active_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/abandoned-carts/index', [
            'carts' => $carts,
            'filters' => ['status' => $status],
        ]);
    }

    /**
     * Mark a cart as manually recovered.
     */
    public function markRecovered(AbandonedCart $cart)
    {
        $cart->update(['status' => 'recovered']);

        return redirect()->back()->with('success', 'Cart marked as recovered.');
    }

    /**
     * Delete an abandoned cart.
     */
    public function destroy(AbandonedCart $cart)
    {
        $cart->delete();

        return redirect()->back()->with('success', 'Cart deleted.');
    }
}
