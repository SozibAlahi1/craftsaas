<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->input('days', 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();

        // Revenue Chart (Group by Date)
        $revenueData = Order::where('created_at', '>=', $startDate)
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(id) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top Products
        $topProducts = \App\Models\OrderItem::selectRaw('name as product_name, SUM(quantity) as total_sold, SUM(price * quantity) as total_revenue')
            ->where('created_at', '>=', $startDate)
            ->groupBy('name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Traffic Sources (from AnalyticsEvent)
        // Group by referrer
        $trafficSources = AnalyticsEvent::where('created_at', '>=', $startDate)
            ->where('event_name', 'PageView')
            ->whereNotNull('referrer')
            ->selectRaw('referrer, COUNT(id) as visits')
            ->groupBy('referrer')
            ->orderByDesc('visits')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                // simple hostname extraction
                $host = parse_url($item->referrer, PHP_URL_HOST) ?? 'Direct';
                return ['source' => $host, 'visits' => $item->visits];
            })
            ->groupBy('source')
            ->map(fn($group, $key) => ['name' => $key, 'value' => $group->sum('visits')])
            ->values();

        if ($trafficSources->isEmpty()) {
            $trafficSources = [['name' => 'Direct', 'value' => 1]]; // fallback for chart
        }

        // Funnel
        $visitors = AnalyticsEvent::where('created_at', '>=', $startDate)->where('event_name', 'PageView')->distinct('session_id')->count('session_id');
        $add_to_cart = AnalyticsEvent::where('created_at', '>=', $startDate)->where('event_name', 'AddToCart')->distinct('session_id')->count('session_id');
        $checkout = AnalyticsEvent::where('created_at', '>=', $startDate)->where('event_name', 'InitiateCheckout')->distinct('session_id')->count('session_id');
        $purchases = Order::where('created_at', '>=', $startDate)->where('status', '!=', 'cancelled')->count();

        $funnelData = [
            ['name' => 'Visitors', 'value' => $visitors],
            ['name' => 'Add to Cart', 'value' => $add_to_cart],
            ['name' => 'Checkout', 'value' => $checkout],
            ['name' => 'Purchase', 'value' => $purchases],
        ];

        return Inertia::render('admin/analytics/index', [
            'days' => $days,
            'revenueData' => $revenueData,
            'topProducts' => $topProducts,
            'trafficSources' => $trafficSources,
            'funnelData' => $funnelData,
        ]);
    }
}
