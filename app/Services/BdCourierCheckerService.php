<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class BdCourierCheckerService
{
    /**
     * Check a customer's delivery success ratio using the BD Courier API.
     *
     * @return array{success_ratio: float, reports: array<int, mixed>}
     */
    public function check(string $phone): array
    {
        $apiKey = $this->getApiKey();

        if (! is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException('BD Courier API key is not configured.');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.trim($apiKey),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post('https://api.bdcourier.com/courier-check', [
            'phone' => $phone,
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('BD Courier API request failed with status '.$response->status());
        }

        $payload = $response->json();

        if (($payload['status'] ?? null) !== 'success') {
            throw new RuntimeException($payload['message'] ?? 'BD Courier API returned an unsuccessful response.');
        }

        $summary = $payload['data']['summary'] ?? null;

        if (! is_array($summary) || ! array_key_exists('success_ratio', $summary) || ! is_numeric($summary['success_ratio'])) {
            throw new RuntimeException('BD Courier API response is missing a valid success ratio.');
        }

        return [
            'success_ratio' => (float) $summary['success_ratio'],
            'reports' => is_array($payload['reports'] ?? null) ? $payload['reports'] : [],
        ];
    }

    protected function getApiKey(): ?string
    {
        $configuredKey = SiteSetting::getValue('bd_courier_api_key');

        if (is_string($configuredKey) && trim($configuredKey) !== '') {
            return trim($configuredKey);
        }

        $envKey = env('BD_COURIER_API_KEY');

        return is_string($envKey) && trim($envKey) !== '' ? trim($envKey) : null;
    }
}
