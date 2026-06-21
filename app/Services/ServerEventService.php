<?php

namespace App\Services;

use App\Models\Pixel;
use App\Models\PixelEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServerEventService
{
    /**
     * Send event to Facebook Conversions API.
     */
    public function sendFacebookCAPI(string $eventName, array $eventData, array $userData, string $eventId = null): void
    {
        $pixels = Pixel::where('is_active', true)->whereNotNull('access_token')->get();

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
                    ]
                ],
            ];

            if ($pixel->test_event_code) {
                $payload['test_event_code'] = $pixel->test_event_code;
            }

            try {
                $response = Http::post("https://graph.facebook.com/v19.0/{$pixel->pixel_id}/events?access_token={$pixel->access_token}", $payload);

                PixelEvent::create([
                    'pixel_id' => $pixel->id,
                    'event_name' => $eventName,
                    'payload' => $payload,
                    'status' => $response->successful() ? 'success' : 'failed',
                    'sent_at' => now(),
                ]);

                if (!$response->successful()) {
                    Log::error("Facebook CAPI Error for Pixel {$pixel->pixel_id}: " . $response->body());
                }
            } catch (\Exception $e) {
                PixelEvent::create([
                    'pixel_id' => $pixel->id,
                    'event_name' => $eventName,
                    'payload' => $payload,
                    'status' => 'error',
                    'sent_at' => now(),
                ]);
                Log::error("Facebook CAPI Exception: " . $e->getMessage());
            }
        }
    }

    /**
     * Send event to TikTok Events API.
     */
    public function sendTikTokEvent(string $eventName, array $eventData, array $userData, string $eventId = null): void
    {
        // Similar implementation for TikTok CAPI can go here
        // Currently a placeholder as per user request focus on Facebook primarily
    }

    /**
     * Hash PII data using SHA256 as required by Meta.
     */
    private function hashUserData(array $userData): array
    {
        $hashed = [];
        
        if (isset($userData['em'])) {
            $hashed['em'] = hash('sha256', strtolower(trim($userData['em'])));
        }
        
        if (isset($userData['ph'])) {
            // Basic phone normalization (remove non-digits)
            $phone = preg_replace('/[^0-9]/', '', $userData['ph']);
            if ($phone) {
                $hashed['ph'] = hash('sha256', $phone);
            }
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
