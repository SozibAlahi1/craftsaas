<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderTrackingController extends Controller
{
    public function index(Request $request)
    {
        $orderNumber = $request->input('order_number');
        $phone = $request->input('phone');

        $order = null;
        $error = null;

        if ($orderNumber && $phone) {
            $orderNumberClean = trim(ltrim(trim($orderNumber), '#'));
            $cleanPhone = preg_replace('/[^\d]/', '', $phone);

            $order = Order::where(function ($query) use ($orderNumberClean) {
                $query->where('order_number', $orderNumberClean)
                    ->orWhere('id', $orderNumberClean);
            })
                ->with(['items', 'statusLogs' => function ($q) {
                    $q->orderBy('created_at', 'asc');
                }])
                ->first();

            if ($order) {
                $dbPhone = preg_replace('/[^\d]/', '', $order->phone);
                if (substr($dbPhone, -11) !== substr($cleanPhone, -11)) {
                    $order = null;
                    $error = 'The phone number provided does not match the order records.';
                }
            } else {
                $error = 'No order was found with that order number.';
            }
        }

        return Inertia::render('track-order/index', [
            'order' => $order ? [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal' => (float) $order->subtotal,
                'shipping' => (float) $order->shipping,
                'total' => (float) $order->total,
                'date' => $order->created_at->format('M d, Y h:i A'),
                'customer' => [
                    'full_name' => $order->full_name,
                    'phone' => $order->phone,
                    'address' => $order->address,
                ],
                'courier_tracking_code' => $order->courier_tracking_code,
                'courier_status' => $order->courier_status,
                'items' => $order->items->map(fn ($item) => [
                    'name' => $item->name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'color' => $item->color,
                    'size' => $item->size,
                    'image' => $item->image,
                ]),
                'logs' => $order->statusLogs->map(fn ($log) => [
                    'status' => $log->status,
                    'created_at' => $log->created_at->format('M d, Y h:i A'),
                ]),
            ] : null,
            'error' => $error,
            'searched' => (bool) ($orderNumber && $phone),
            'inputs' => [
                'order_number' => $orderNumber,
                'phone' => $phone,
            ],
        ]);
    }
}
