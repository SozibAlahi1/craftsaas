<?php

namespace App\Services\SMS;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BanglalinkSMSProvider implements SMSServiceInterface
{
    protected string $username;
    protected string $password;
    protected string $shortcode;

    public function __construct()
    {
        $this->username = config('services.banglalink.username', '');
        $this->password = config('services.banglalink.password', '');
        $this->shortcode = config('services.banglalink.shortcode', '');
    }

    public function send(string $phone, string $message): array
    {
        try {
            // Placeholder API endpoint for Banglalink
            $response = Http::get('https://sms.banglalink.com/api/send', [
                'user' => $this->username,
                'pass' => $this->password,
                'sms[0][0]' => $phone,
                'sms[0][1]' => $message,
                'sid' => $this->shortcode,
            ]);

            return [
                'success' => $response->successful(),
                'response' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Banglalink SMS Error: ' . $e->getMessage());
            return [
                'success' => false,
                'response' => $e->getMessage(),
            ];
        }
    }
}
