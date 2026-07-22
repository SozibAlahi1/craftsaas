<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index()
    {
        $cart = Session::get('cart', []);

        if (empty($cart)) {
            return redirect()->route('products.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('checkout/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Handle the checkout process.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^(?:\+88|88)?(01[3-9]\d{8})$/'],
            'address' => ['required', 'string', 'min:10', 'max:500'],
            'payment_method' => ['required', 'string', 'in:cod,bkash,nagad'],
            'shipping_area' => ['required', 'string', 'in:inside,outside'],
        ], [
            'phone.regex' => 'Please provide a valid Bangladesh phone number (e.g. 01XXXXXXXXX).',
            'address.min' => 'Please provide a more detailed address.',
        ]);

        if (\App\Models\BlockedCustomer::where('phone', $validated['phone'])->exists()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'phone' => 'This phone number has been restricted from placing new orders.',
            ]);
        }

        $cart = Session::get('cart', []);

        if (empty($cart)) {
            return redirect()->route('products.index')->with('error', 'Your cart is empty.');
        }

        return DB::transaction(function () use ($validated, $cart) {
            // Calculate totals
            $subtotal = collect($cart)->reduce(function ($sum, $item) {
                $price = (int) preg_replace('/[^\d]/', '', $item['price']);

                return $sum + ($price * $item['quantity']);
            }, 0);
            $shipping_cost_inside = (int) SiteSetting::getValue('shipping_cost_inside_dhaka', 60);
            $shipping_cost_outside = (int) SiteSetting::getValue('shipping_cost_outside_dhaka', 120);
            $shipping = $validated['shipping_area'] === 'inside' ? $shipping_cost_inside : $shipping_cost_outside;
            $total = $subtotal + $shipping;

            // Create Order
            $order = Order::create([
                'order_number' => 'WT-'.strtoupper(substr(uniqid(), -6)),
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
            ]);

            // Sync Customer
            $customerSegmentService = new \App\Services\CustomerSegmentService();
            $customer = $customerSegmentService->syncFromOrder($order);
            
            $order->update(['customer_id' => $customer->id]);

            // Create Order Items
            foreach ($cart as $item) {
                $product = Product::where('slug', $item['slug'])->lockForUpdate()->first();

                if ($product) {
                    if (!$product->is_in_stock || $product->stock_quantity < $item['quantity']) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'cart' => "Sorry, '{$product->name}' is out of stock or does not have enough quantity.",
                        ]);
                    }

                    // Decrement product stock
                    $product->decrement('stock_quantity', $item['quantity']);
                    
                    // Auto-update is_in_stock if it reaches 0
                    if ($product->stock_quantity <= 0) {
                        $product->update(['is_in_stock' => false]);
                    }

                    // Decrement variant stock if exists
                    if (isset($item['product_variant_id']) && $item['product_variant_id']) {
                        $variant = \App\Models\ProductVariant::where('id', $item['product_variant_id'])->lockForUpdate()->first();
                        if ($variant) {
                            $variant->decrement('stock_quantity', $item['quantity']);
                        }
                    }
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product?->id,
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'name' => $item['name'],
                    'price' => (int) preg_replace('/[^\d]/', '', $item['price']),
                    'quantity' => $item['quantity'],
                    'options' => [
                        'color' => $item['color'] ?? null,
                        'size' => $item['size'] ?? null,
                        'image' => $item['image'] ?? null,
                    ],
                ]);
            }

            // Evaluate Risk Score
            $riskScoringService = new \App\Services\RiskScoringService();
            $riskScoringService->evaluate($order);

            // Prepare order details for the thank you page (for UI display)
            $orderDetails = [
                'order_id' => $order->order_number,
                'customer' => $validated,
                'items' => $cart,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'date' => $order->created_at->format('M d, Y'),
            ];

            // Mark abandoned cart as recovered
            \App\Models\AbandonedCart::where('session_id', Session::getId())->update(['status' => 'recovered']);

            // Store in session and clear cart
            Session::put('last_order', $orderDetails);
            Session::forget('cart');

            \App\Jobs\OrderConfirmationCallJob::dispatch($order)->afterCommit();

            return redirect()->route('checkout.thank-you');
        });
    }

    /**
     * Display the thank you page.
     */
    public function thankYou()
    {
        $order = Session::get('last_order');

        if (! $order) {
            return redirect()->route('home');
        }

        return Inertia::render('checkout/thank-you', [
            'order' => $order,
        ]);
    }

    /**
     * Silently save contact info for abandoned cart recovery
     */
    public function saveContact(Request $request)
    {
        // The CaptureCartData middleware automatically captures cart data and contact info
        // from the request, so we just need to return back to preserve the Inertia state.
        return back();
    }
}
