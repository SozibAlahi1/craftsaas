<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Order;
use App\Models\ProfitSnapshot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->input('days', 30);
        $startDate = now()->subDays($days)->startOfDay();

        $cacheKey = "finance_dashboard_{$days}";

        $data = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($startDate) {
            // Profit table data
            $snapshots = ProfitSnapshot::with('order.customer')
                ->where('calculated_at', '>=', $startDate)
                ->orderBy('calculated_at', 'desc')
                ->get();

            $totalRevenue = $snapshots->sum('revenue');
            $totalProductCost = $snapshots->sum('product_cost');
            $totalCourierCost = $snapshots->sum('courier_cost');
            $totalAdSpend = $snapshots->sum('ad_spend');
            $grossProfit = $snapshots->sum('gross_profit');
            $netProfit = $snapshots->sum('net_profit');

            $roas = $totalAdSpend > 0 ? ($totalRevenue / $totalAdSpend) : 0;

            // Trend Chart (Daily)
            $trend = ProfitSnapshot::selectRaw('DATE(calculated_at) as date, SUM(net_profit) as daily_profit')
                ->where('calculated_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Expenses breakdown
            $expenses = Expense::selectRaw('category, SUM(amount) as total')
                ->where('date', '>=', $startDate)
                ->groupBy('category')
                ->get();

            return [
                'summary' => [
                    'revenue' => $totalRevenue,
                    'product_cost' => $totalProductCost,
                    'courier_cost' => $totalCourierCost,
                    'ad_spend' => $totalAdSpend,
                    'gross_profit' => $grossProfit,
                    'net_profit' => $netProfit,
                    'roas' => round($roas, 2),
                ],
                'trend' => $trend,
                'expenses' => $expenses,
                'snapshots' => $snapshots->take(50), // Send last 50 for table display to avoid huge payload
            ];
        });

        return Inertia::render('admin/finance/index', [
            'data' => $data,
            'days' => $days,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $days = (int) $request->input('days', 30);
        $startDate = now()->subDays($days)->startOfDay();

        $snapshots = ProfitSnapshot::with('order')->where('calculated_at', '>=', $startDate)->orderBy('calculated_at', 'desc')->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=profit_report.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($snapshots) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Order ID', 'Date', 'Revenue', 'Product Cost', 'Courier Cost', 'Ad Spend', 'Gross Profit', 'Net Profit']);

            foreach ($snapshots as $row) {
                fputcsv($file, [
                    $row->order->order_number ?? $row->order_id,
                    $row->calculated_at->format('Y-m-d H:i'),
                    $row->revenue,
                    $row->product_cost,
                    $row->courier_cost,
                    $row->ad_spend,
                    $row->gross_profit,
                    $row->net_profit,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
