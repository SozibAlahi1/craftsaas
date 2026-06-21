<?php

namespace App\Services;

use App\Models\AdAccount;
use App\Models\AdSpendLog;
use App\Models\Campaign;
use App\Models\FacebookAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaAdsService
{
    /**
     * Sync ad accounts for a given facebook account.
     */
    public function syncAdAccounts(FacebookAccount $account): void
    {
        $response = Http::get("https://graph.facebook.com/v19.0/me/adaccounts", [
            'access_token' => $account->access_token,
            'fields' => 'id,name',
        ]);

        if ($response->successful()) {
            foreach ($response->json('data') as $adAccount) {
                AdAccount::updateOrCreate(
                    ['account_id' => $adAccount['id']],
                    [
                        'facebook_account_id' => $account->id,
                        'name' => $adAccount['name'] ?? $adAccount['id'],
                    ]
                );
            }
        } else {
            Log::error("Failed to sync ad accounts: " . $response->body());
        }
    }

    /**
     * Sync daily spend for all active campaigns.
     */
    public function syncDailySpend(string $date = null): void
    {
        $date = $date ?? now()->subDay()->toDateString(); // Default to yesterday's spend
        
        $adAccounts = AdAccount::with('facebookAccount')->get();

        foreach ($adAccounts as $adAccount) {
            $token = $adAccount->facebookAccount->access_token;
            
            $response = Http::get("https://graph.facebook.com/v19.0/{$adAccount->account_id}/insights", [
                'access_token' => $token,
                'time_range' => json_encode(['since' => $date, 'until' => $date]),
                'level' => 'campaign',
                'fields' => 'campaign_id,campaign_name,spend,impressions,clicks,reach',
            ]);

            if ($response->successful()) {
                foreach ($response->json('data') as $insight) {
                    $campaign = Campaign::firstOrCreate(
                        ['campaign_id' => $insight['campaign_id']],
                        [
                            'ad_account_id' => $adAccount->id,
                            'name' => $insight['campaign_name'],
                        ]
                    );

                    AdSpendLog::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'date' => $date,
                            'adset_id' => null,
                            'ad_id' => null,
                        ],
                        [
                            'spend' => $insight['spend'] ?? 0,
                            'impressions' => $insight['impressions'] ?? 0,
                            'clicks' => $insight['clicks'] ?? 0,
                            'reach' => $insight['reach'] ?? 0,
                        ]
                    );
                }
            } else {
                Log::error("Failed to sync insights for {$adAccount->account_id}: " . $response->body());
            }
        }
    }
}
