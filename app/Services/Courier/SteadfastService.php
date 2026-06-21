<?php

namespace App\Services\Courier;

use App\Models\SiteSetting;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteadfastService implements CourierServiceInterface
{
    protected string $baseUrl = 'https://portal.packzy.com/api/v1';

    /**
     * Get API credentials.
     */
    protected function getCredentials(): ?array
    {
        $apiKey = SiteSetting::getValue('courier_api_key');
        $secretKey = SiteSetting::getValue('courier_secret_key');

        if (! $apiKey || ! $secretKey) {
            return null;
        }

        return [
            'api_key' => $apiKey,
            'secret_key' => $secretKey,
        ];
    }

    public function getName(): string
    {
        return 'Steadfast';
    }

    /**
     * Create a consignment for the given order.
     */
    public function createConsignment(Order $order): array
    {
        $creds = $this->getCredentials();
        if (! $creds) {
            return [
                'status' => 400,
                'message' => 'Courier is not configured.',
            ];
        }

        $recipientPhone = preg_replace('/^(?:\+88|88)/', '', trim($order->phone));
        $recipientPhone = preg_replace('/[^\d]/', '', $recipientPhone);
        $recipientAddress = mb_substr($order->address, 0, 250);
        $codAmount = in_array(strtolower($order->payment_method), ['bkash', 'nagad', 'sslcommerz']) ? 0 : (int) $order->total;
        
        $itemsDescription = $order->items->map(function ($item) {
            return "{$item->name} (x{$item->quantity})";
        })->implode(', ');
        if (empty($itemsDescription)) {
            $itemsDescription = 'Wild Tannery Leather Goods';
        }

        $params = [
            'invoice' => $order->order_number,
            'recipient_name' => mb_substr($order->full_name, 0, 100),
            'recipient_phone' => $recipientPhone,
            'recipient_address' => $recipientAddress,
            'cod_amount' => $codAmount,
            'note' => 'Order #'.$order->order_number,
            'item_description' => mb_substr($itemsDescription, 0, 250),
        ];
        try {
            $response = Http::withHeaders([
                'Api-Key' => $creds['api_key'],
                'Secret-Key' => $creds['secret_key'],
                'Content-Type' => 'application/json',
            ])
                ->timeout(10)
                ->connectTimeout(5)
                ->post($this->baseUrl.'/create_order', $params);

            if ($response->failed()) {
                return [
                    'status' => $response->status(),
                    'message' => 'API request failed: '.($response->json('message') ?? $response->body()),
                ];
            }

            $data = $response->json();
            if (isset($data['status']) && $data['status'] == 200 && isset($data['consignment'])) {
                return [
                    'status' => 200,
                    'consignment_id' => $data['consignment']['consignment_id'],
                    'tracking_code' => $data['consignment']['tracking_code'],
                    'raw_response' => $data,
                ];
            }

            return [
                'status' => 500,
                'message' => 'Failed to parse successful response.',
            ];
        } catch (\Exception $e) {
            Log::error('Steadfast API Order Creation Error: '.$e->getMessage());

            return [
                'status' => 500,
                'message' => 'Connection error: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Get the current balance.
     */
    public function getBalance(): array
    {
        $creds = $this->getCredentials();
        if (! $creds) {
            return [
                'status' => 400,
                'message' => 'Courier is not configured.',
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $creds['api_key'],
                'Secret-Key' => $creds['secret_key'],
                'Content-Type' => 'application/json',
            ])
                ->timeout(10)
                ->connectTimeout(5)
                ->get($this->baseUrl.'/get_balance');

            if ($response->failed()) {
                return [
                    'status' => $response->status(),
                    'message' => 'API request failed.',
                ];
            }

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Connection error: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Track a shipment by its tracking code.
     */
    public function trackShipment(string $trackingCode): array
    {
        $creds = $this->getCredentials();
        if (! $creds) {
            return [
                'status' => 400,
                'message' => 'Courier is not configured.',
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $creds['api_key'],
                'Secret-Key' => $creds['secret_key'],
                'Content-Type' => 'application/json',
            ])
                ->timeout(10)
                ->connectTimeout(5)
                ->get($this->baseUrl."/status_by_trackingcode/{$trackingCode}");

            if ($response->failed()) {
                return [
                    'status' => $response->status(),
                    'message' => 'API request failed.',
                ];
            }

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Connection error: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Cancel a shipment.
     */
    public function cancelShipment(string $trackingCode): array
    {
        // Steadfast API doesn't document cancellation easily via API, so we mock or return error
        return [
            'status' => 501,
            'message' => 'Cancellation not supported automatically for Steadfast.',
        ];
    }
}
