<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AbandonedCart;

class CaptureCartData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $cart = session('cart', []);
        
        if (!empty($cart)) {
            $abandonedCart = AbandonedCart::firstOrNew(['session_id' => session()->getId()]);
            
            $abandonedCart->cart_data = $cart;
            $abandonedCart->last_active_at = now();
            
            if ($request->filled('full_name')) {
                $abandonedCart->customer_name = $request->input('full_name');
            }
            if ($request->filled('phone')) {
                $abandonedCart->customer_phone = $request->input('phone');
            }
            if ($request->filled('address')) {
                $abandonedCart->customer_address = $request->input('address');
            }
            
            $abandonedCart->save();
        }

        return $response;
    }
}
