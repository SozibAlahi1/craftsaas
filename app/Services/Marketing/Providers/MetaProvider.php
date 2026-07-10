<?php

namespace App\Services\Marketing\Providers;

use App\Models\Order;
use App\Models\Pixel;
use App\Services\Marketing\Contracts\MarketingProvider;
use Illuminate\Support\Facades\Http;

class MetaProvider implements MarketingProvider
{
    public function getName(): string
    {
        return 'meta';
    }

    /**
     * Send event to Meta Conversions API.
     *
     * @throws \Exception
     */
    public function sendEvent(string $eventName, Order $order, array $eventData, array $userData, ?string $eventId = null): array
    {
        $pixels = Pixel::where('is_active', true)->whereNotNull('access_token')->get();

        if ($pixels->isEmpty()) {
            return ['status' => 'skipped', 'message' => 'No active pixels with Conversions API access token configured.'];
        }

        $results = [];
        $hasError = false;
        $errorMessage = '';

        foreach ($pixels as $pixel) {
            $hashedUserData = $this->hashUserData($userData);

            $payload = [
                'data' => [
                    [
                        'event_name' => $eventName,
                        'event_time' => time(),
                        'action_source' => 'website',
                        'event_id' => $eventId,
                        'user_data' => $hashedUserData,
                        'custom_data' => $eventData,
                    ],
                ],
            ];

            if ($pixel->test_event_code) {
                $payload['test_event_code'] = $pixel->test_event_code;
            }

            try {
                $response = Http::timeout(10)
                    ->connectTimeout(5)
                    ->post("https://graph.facebook.com/v19.0/{$pixel->pixel_id}/events?access_token={$pixel->access_token}", $payload);

                $results[$pixel->pixel_id] = [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ];

                if (! $response->successful()) {
                    $hasError = true;
                    $errorMessage .= "Pixel [{$pixel->pixel_id}] error: ".$response->body().'; ';
                }
            } catch (\Exception $e) {
                $hasError = true;
                $errorMessage .= "Pixel [{$pixel->pixel_id}] exception: ".$e->getMessage().'; ';
                $results[$pixel->pixel_id] = [
                    'status' => 'exception',
                    'error' => $e->getMessage(),
                ];
            }
        }

        if ($hasError) {
            throw new \Exception('Meta CAPI failed: '.$errorMessage);
        }

        return $results;
    }

    /**
     * Hash PII data using SHA256 as required by Meta.
     */
    private function hashUserData(array $userData): array
    {
        $hashed = [];

        if (isset($userData['em']) && $userData['em']) {
            $hashed['em'] = hash('sha256', strtolower(trim($userData['em'])));
        }

        if (isset($userData['ph']) && $userData['ph']) {
            $phone = preg_replace('/[^0-9]/', '', $userData['ph']);
            if ($phone) {
                $hashed['ph'] = hash('sha256', $phone);
            }
        }

        if (isset($userData['fn']) && $userData['fn']) {
            $hashed['fn'] = $userData['fn'];
        }

        if (isset($userData['ln']) && $userData['ln']) {
            $hashed['ln'] = $userData['ln'];
        }

        if (isset($userData['client_ip_address'])) {
            $hashed['client_ip_address'] = $userData['client_ip_address'];
        }

        if (isset($userData['client_user_agent'])) {
            $hashed['client_user_agent'] = $userData['client_user_agent'];
        }

        if (isset($userData['fbc'])) {
            $hashed['fbc'] = $userData['fbc'];
        }

        if (isset($userData['fbp'])) {
            $hashed['fbp'] = $userData['fbp'];
        }

        return $hashed;
    }
}
