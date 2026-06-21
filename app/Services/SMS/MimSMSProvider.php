<?php

namespace App\Services\SMS;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MimSMSProvider implements SMSServiceInterface
{
    protected string $apiKey;
    protected string $senderId;

    public function __construct()
    {
        $this->apiKey = config('services.mimsms.api_key', '');
        $this->senderId = config('services.mimsms.sender_id', '');
    }

    public function send(string $phone, string $message): array
    {
        try {
            $response = Http::post('https://api.mimsms.com/api/sendsms', [
                'api_key' => $this->apiKey,
                'senderid' => $this->senderId,
                'contacts' => $phone,
                'msg' => $message,
            ]);

            return [
                'success' => $response->successful(),
                'response' => $response->json() ?? $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('MimSMS Error: ' . $e->getMessage());
            return [
                'success' => false,
                'response' => $e->getMessage(),
            ];
        }
    }
}
