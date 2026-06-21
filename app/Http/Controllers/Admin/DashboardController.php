<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $dateFrom = $request->query('date_from');
        $dateTo   = $request->query('date_to');

        /** @var \Illuminate\Database\Eloquent\Builder $base */
        $base = Order::query();

        if ($dateFrom) {
            $base->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $base->whereDate('created_at', '<=', $dateTo);
        }

        // ── Stat cards ──────────────────────────────────────────────────
        $todayOrders     = (clone $base)->whereDate('created_at', today())->count();
        $confirmedOrders = (clone $base)->where('status', 'confirmed')->count();
        $pendingOrders   = (clone $base)->where('status', 'pending')->count();
        $deliveredOrders = (clone $base)->where('status', 'delivered')->count();
        $cancelledOrders = (clone $base)->where('status', 'cancelled')->count();
        $returnOrders    = (clone $base)->where('status', 'returned')->count();
        $courierOrders   = (clone $base)->whereNotNull('courier_consignment_id')->count();
        $totalOrders      = (clone $base)->count();
        $totalProducts    = Product::count();
        $totalCategories  = Category::count();

        $totalRevenue = (clone $base)->where('status', '!=', 'cancelled')
            ->sum('total');

        // ── Weekly revenue chart (last 7 days) ──────────────────────────
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $revenue = Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('total');
            $profit = round($revenue * 0.20, 2); // assume 20% profit
            $weeklyData[] = [
                'day'     => $date->format('D'),
                'date'    => $date->format('Y-m-d'),
                'revenue' => (float) $revenue,
                'profit'  => (float) $profit,
            ];
        }

        // ── Monthly revenue (last 6 months) ─────────────────────────────
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenue = Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->where('status', '!=', 'cancelled')
                ->sum('total');
            $profit = round($revenue * 0.20, 2);
            $monthlyData[] = [
                'day'     => $month->format('M'),
                'date'    => $month->format('Y-m'),
                'revenue' => (float) $revenue,
                'profit'  => (float) $profit,
            ];
        }

        // ── Sales by category ────────────────────────────────────────────
        $salesByCategory = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.status', '!=', 'cancelled')
            ->selectRaw('categories.name, sum(order_items.quantity * order_items.price) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        // ── Recent orders ────────────────────────────────────────────────
        $recentOrders = Order::with('items')
            ->latest()
            ->limit(8)
            ->get(['id', 'order_number', 'full_name', 'phone', 'total', 'status', 'payment_method', 'created_at']);

        // ── Top products ─────────────────────────────────────────────────
        $topProducts = \DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('products.id, products.name, products.image, sum(order_items.quantity) as qty_sold, sum(order_items.quantity * order_items.price) as revenue')
            ->groupBy('products.id', 'products.name', 'products.image')
            ->orderByDesc('qty_sold')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'today_orders'     => $todayOrders,
                'confirmed_orders' => $confirmedOrders,
                'pending_orders'   => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,
                'return_orders'    => $returnOrders,
                'courier_orders'   => $courierOrders,
                'total_orders'      => $totalOrders,
                'total_products'    => $totalProducts,
                'total_categories'  => $totalCategories,
                'total_revenue'     => $totalRevenue,
            ],
            'weeklyData'       => $weeklyData,
            'monthlyData'      => $monthlyData,
            'salesByCategory'  => $salesByCategory,
            'recentOrders'     => $recentOrders,
            'topProducts'      => $topProducts,
        ]);
    }
}
