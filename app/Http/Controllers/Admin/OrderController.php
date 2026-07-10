<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Services\BdCourierCheckerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
}
