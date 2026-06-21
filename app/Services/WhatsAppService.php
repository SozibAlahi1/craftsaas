<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $token;
    protected string $phoneId;
    protected string $version;

    public function __construct()
    {
        $this->token = config('services.whatsapp.token', '');
        $this->phoneId = config('services.whatsapp.phone_id', '');
        $this->version = config('services.whatsapp.version', 'v19.0');
    }

    public function sendTemplate(string $to, string $templateName, string $languageCode = 'en', array $components = []): array
    {
        try {
            $url = "https://graph.facebook.com/{$this->version}/{$this->phoneId}/messages";
            
            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => ['code' => $languageCode],
                ],
            ];

            if (!empty($components)) {
                $payload['template']['components'] = $components;
            }

            $response = Http::withToken($this->token)->post($url, $payload);

            return [
                'success' => $response->successful(),
                'response' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('WhatsApp API Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
    
    public function sendText(string $to, string $text): array
    {
        try {
            $url = "https://graph.facebook.com/{$this->version}/{$this->phoneId}/messages";
            
            $payload = [
                'messaging_product' => 'whatsapp',
                'recipient_type' => 'individual',
                'to' => $to,
                'type' => 'text',
                'text' => [
                    'preview_url' => false,
                    'body' => $text,
                ],
            ];

            $response = Http::withToken($this->token)->post($url, $payload);

            return [
                'success' => $response->successful(),
                'response' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('WhatsApp API Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
