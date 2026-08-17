<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedCustomer;
use App\Models\Order;
use App\Models\OrderActivity;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\BdCourierCheckerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(protected BdCourierCheckerService $bdCourierCheckerService) {}

    public function index(Request $request): Response
    {
        $query = Order::with('items', 'riskScore')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('full_name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return Inertia::render('admin/orders/index', [
            'orders' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'payment_method', 'date_from', 'date_to']),
        ]);
    }

    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'status' => 'required|string',
        ]);

        $orders = Order::whereIn('id', $validated['order_ids'])->get();

        foreach ($orders as $order) {
            $order->update(['status' => $validated['status']]);

            OrderStatusLog::create([
                'order_id' => $order->id,
                'status' => $validated['status'],
                'changed_by' => auth()->id(),
            ]);
        }

        return back()->with('success', $orders->count().' orders updated successfully.');
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load('items', 'riskScore'),
            'activities' => $order->activities()->with('user')->latest()->get(),
            'statusLogs' => $order->statusLogs()->with('changer')->latest()->get(),
            'notes' => $order->notes()->with('user')->latest()->get(),
        ]);
    }

    public function print(Order $order, $size)
    {
        $validSizes = ['a4', 'thermal58', 'thermal80'];
        if (! in_array($size, $validSizes)) {
            abort(404);
        }

        $order->load('items');

        return view("admin.orders.print.{$size}", compact('order'));
    }

    /**
     * Check a customer's courier success ratio using the BD Courier API.
     * Saves the result to the order so it is only fetched once.
     */
    public function fraudCheck(Order $order): RedirectResponse
    {
        if (! is_null($order->fraud_success_ratio)) {
            return redirect()->route('admin.orders.index')->with('success', 'Ford Checker result already available.');
        }

        $phone = preg_replace('/^(?:\+88|88)/', '', trim($order->phone));
        $phone = preg_replace('/[^\d]/', '', $phone);

        if (! preg_match('/^01[3-9]\d{8}$/', $phone)) {
            return back()->with('error', 'Invalid phone number format.');
        }

        try {
            $result = $this->bdCourierCheckerService->check($phone);
            $ratio = $result['success_ratio'];

            $order->update(['fraud_success_ratio' => $ratio]);

            return redirect()->route('admin.orders.index')->with('success', 'Ford Checker updated successfully.');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Could not fetch fraud data: '.$e->getMessage());
        }
    }

    public function edit(Order $order): Response
    {
        $products = Product::select('id', 'name', 'price', 'image')->latest()->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) preg_replace('/[^\d.]/', '', (string) $product->price),
                'image' => $product->image,
            ];
        });

        return Inertia::render('admin/orders/edit', [
            'order' => $order->load('items'),
            'products' => $products,
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:1000',
            'payment_method' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'shipping' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|integer',
            'items.*.product_id' => 'nullable|integer',
            'items.*.product_variant_id' => 'nullable|integer',
            'items.*.name' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.options' => 'nullable',
        ]);

        DB::transaction(function () use ($validated, $order) {
            $oldData = $order->only(['full_name', 'phone', 'address', 'payment_method', 'status', 'shipping', 'subtotal', 'total']);
            $oldStatus = $order->status;

            $oldItems = $order->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'quantity' => (int) $item->quantity,
            ])->keyBy('id')->toArray();

            // Compute subtotal and total
            $subtotal = 0;
            foreach ($validated['items'] as $itemData) {
                $subtotal += $itemData['price'] * $itemData['quantity'];
            }
            $shipping = (float) $validated['shipping'];
            $total = $subtotal + $shipping;

            // Sync order items & track item level diffs
            $addedItems = [];
            $updatedItems = [];
            $existingItemIds = [];

            foreach ($validated['items'] as $itemData) {
                $options = is_array($itemData['options'] ?? null) ? $itemData['options'] : null;

                if (! empty($itemData['id']) && isset($oldItems[$itemData['id']])) {
                    $oldItem = $oldItems[$itemData['id']];
                    $item = OrderItem::where('order_id', $order->id)->where('id', $itemData['id'])->first();
                    if ($item) {
                        $item->update([
                            'product_id' => $itemData['product_id'] ?? null,
                            'product_variant_id' => $itemData['product_variant_id'] ?? null,
                            'name' => $itemData['name'],
                            'price' => $itemData['price'],
                            'quantity' => $itemData['quantity'],
                            'options' => $options,
                        ]);
                        $existingItemIds[] = $item->id;

                        if ($oldItem['name'] !== $itemData['name'] || $oldItem['price'] != $itemData['price'] || $oldItem['quantity'] != $itemData['quantity']) {
                            $updatedItems[] = [
                                'name' => $itemData['name'],
                                'old_price' => $oldItem['price'],
                                'new_price' => $itemData['price'],
                                'old_quantity' => $oldItem['quantity'],
                                'new_quantity' => $itemData['quantity'],
                            ];
                        }

                        continue;
                    }
                }

                $newItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'] ?? null,
                    'product_variant_id' => $itemData['product_variant_id'] ?? null,
                    'name' => $itemData['name'],
                    'price' => $itemData['price'],
                    'quantity' => $itemData['quantity'],
                    'options' => $options,
                ]);
                $existingItemIds[] = $newItem->id;

                $addedItems[] = [
                    'name' => $itemData['name'],
                    'price' => $itemData['price'],
                    'quantity' => $itemData['quantity'],
                ];
            }

            // Remove items no longer in the order
            $removedItems = [];
            foreach ($oldItems as $oldId => $oldItem) {
                if (! in_array($oldId, $existingItemIds)) {
                    $removedItems[] = [
                        'name' => $oldItem['name'],
                        'price' => $oldItem['price'],
                        'quantity' => $oldItem['quantity'],
                    ];
                }
            }

            OrderItem::where('order_id', $order->id)
                ->whereNotIn('id', $existingItemIds)
                ->delete();

            // Update order details
            $order->update([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'payment_method' => $validated['payment_method'],
                'status' => $validated['status'],
                'shipping' => $shipping,
                'subtotal' => $subtotal,
                'total' => $total,
            ]);

            // Log status change if status changed
            if ($oldStatus !== $validated['status']) {
                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'status' => $validated['status'],
                    'changed_by' => auth()->id(),
                ]);
            }

            // Log order activity with rich item & field changes
            $newPayload = array_merge(
                $order->only(['full_name', 'phone', 'address', 'payment_method', 'status', 'shipping', 'subtotal', 'total']),
                [
                    'added_items' => $addedItems,
                    'removed_items' => $removedItems,
                    'updated_items' => $updatedItems,
                ]
            );

            OrderActivity::create([
                'order_id' => $order->id,
                'user_id' => auth()->id(),
                'action' => 'Order Updated',
                'old_value' => $oldData,
                'new_value' => $newPayload,
            ]);
        });

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Order updated successfully.');
    }

    public function searchProducts(Request $request): JsonResponse
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', '%'.$query.'%')
            ->select('id', 'name', 'price', 'image')
            ->take(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) preg_replace('/[^\d.]/', '', (string) $product->price),
                    'image' => $product->image,
                ];
            });

        return response()->json($products);
    }

    public function destroy(Order $order, Request $request): RedirectResponse
    {
        DB::transaction(function () use ($order, $request) {
            $restoreStock = $request->boolean('restore_stock', true);

            if ($restoreStock) {
                foreach ($order->items as $item) {
                    if ($item->product_id) {
                        $product = Product::find($item->product_id);
                        if ($product) {
                            $product->increment('stock_quantity', $item->quantity);
                            if ($product->stock_quantity > 0 && ! $product->is_in_stock) {
                                $product->update(['is_in_stock' => true]);
                            }
                        }
                    }

                    if ($item->product_variant_id) {
                        $variant = ProductVariant::find($item->product_variant_id);
                        if ($variant) {
                            $variant->increment('stock_quantity', $item->quantity);
                        }
                    }
                }
            }

            $order->items()->delete();
            $order->activities()->delete();
            $order->statusLogs()->delete();
            $order->notes()->delete();
            $order->callLogs()->delete();
            $order->riskScore()?->delete();
            $order->delete();
        });

        return back()->with('success', 'Order deleted successfully.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'restore_stock' => 'nullable|boolean',
        ]);

        $orders = Order::whereIn('id', $validated['order_ids'])->with('items')->get();
        $count = $orders->count();
        $restoreStock = $request->boolean('restore_stock', true);

        DB::transaction(function () use ($orders, $restoreStock) {
            foreach ($orders as $order) {
                if ($restoreStock) {
                    foreach ($order->items as $item) {
                        if ($item->product_id) {
                            $product = Product::find($item->product_id);
                            if ($product) {
                                $product->increment('stock_quantity', $item->quantity);
                                if ($product->stock_quantity > 0 && ! $product->is_in_stock) {
                                    $product->update(['is_in_stock' => true]);
                                }
                            }
                        }

                        if ($item->product_variant_id) {
                            $variant = ProductVariant::find($item->product_variant_id);
                            if ($variant) {
                                $variant->increment('stock_quantity', $item->quantity);
                            }
                        }
                    }
                }

                $order->items()->delete();
                $order->activities()->delete();
                $order->statusLogs()->delete();
                $order->notes()->delete();
                $order->callLogs()->delete();
                $order->riskScore()?->delete();
                $order->delete();
            }
        });

        return back()->with('success', "{$count} orders deleted successfully.");
    }

    public function blockPhone(Order $order): RedirectResponse
    {
        if (empty($order->phone)) {
            return back()->with('error', 'Order has no phone number.');
        }

        BlockedCustomer::firstOrCreate(
            ['phone' => $order->phone],
            [
                'reason' => 'Blocked via Order #'.$order->order_number,
                'blocked_by' => auth()->id(),
            ]
        );

        return back()->with('success', "Phone number {$order->phone} added to blocklist.");
    }
}
