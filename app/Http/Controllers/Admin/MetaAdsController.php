<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FacebookAccount;
use App\Models\Campaign;
use App\Services\MetaAdsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetaAdsController extends Controller
{
    public function index()
    {
        $accounts = FacebookAccount::all();
        
        $campaigns = Campaign::with(['adAccount.facebookAccount', 'spendLogs' => function($query) {
            $query->where('date', '>=', now()->subDays(30));
        }])->get()->map(function($campaign) {
            $spend = $campaign->spendLogs->sum('spend');
            $clicks = $campaign->spendLogs->sum('clicks');
            $cpc = $clicks > 0 ? $spend / $clicks : 0;
            return [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'account' => $campaign->adAccount->name,
                'status' => $campaign->status,
                'total_spend' => $spend,
                'clicks' => $clicks,
                'cpc' => round($cpc, 2),
            ];
        });

        return Inertia::render('admin/meta-ads/index', [
            'accounts' => $accounts,
            'campaigns' => $campaigns,
        ]);
    }

    public function storeAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'account_id' => 'required|string|unique:facebook_accounts',
            'access_token' => 'required|string',
        ]);

        $account = FacebookAccount::create($validated);
        
        app(MetaAdsService::class)->syncAdAccounts($account);

        return redirect()->back()->with('success', 'Account added and ad accounts synced.');
    }

    public function syncData(MetaAdsService $metaAdsService)
    {
        $metaAdsService->syncDailySpend(now()->toDateString());
        $metaAdsService->syncDailySpend(now()->subDay()->toDateString());
        
        // Clear finance cache since we imported new spend
        \Illuminate\Support\Facades\Cache::forget('finance_dashboard_7');
        \Illuminate\Support\Facades\Cache::forget('finance_dashboard_30');
        \Illuminate\Support\Facades\Cache::forget('finance_dashboard_90');

        return redirect()->back()->with('success', 'Meta Ads data synced successfully.');
    }
}
