<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\CourierShipment;
use App\Services\Courier\SteadfastService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourierController extends Controller
{
    public function __construct(protected SteadfastService $steadfastService) {}

    /**
     * Display the Courier Configuration page.
     */
    public function index(): Response
    {
        $apiKey = SiteSetting::getValue('courier_api_key');
        $secretKey = SiteSetting::getValue('courier_secret_key');
        $bdCourierApiKey = SiteSetting::getValue('bd_courier_api_key');

        $balanceInfo = null;
        if ($apiKey && $secretKey) {
            $balanceInfo = $this->steadfastService->getBalance();
        }

        return Inertia::render('admin/courier/configure', [
            'apiKey' => $apiKey ?? '',
            'secretKey' => $secretKey ?? '',
            'bdCourierApiKey' => $bdCourierApiKey ?? '',
            'balance' => $balanceInfo['current_balance'] ?? null,
            'balanceError' => isset($balanceInfo['message']) && ! isset($balanceInfo['current_balance']) ? $balanceInfo['message'] : null,
        ]);
    }

    /**
     * Update the Steadfast and BD Courier API keys.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'courier_api_key' => 'required|string|max:255',
            'courier_secret_key' => 'required|string|max:255',
            'bd_courier_api_key' => 'nullable|string|max:255',
        ]);

        SiteSetting::setValue('courier_api_key', $validated['courier_api_key']);
        SiteSetting::setValue('courier_secret_key', $validated['courier_secret_key']);
        SiteSetting::setValue('bd_courier_api_key', $validated['bd_courier_api_key'] ?? '');

        return redirect()->back()->with('success', 'Courier configuration updated successfully.');
    }

    /**
     * Dispatch an order to Steadfast Courier.
     */
    public function sendToCourier(Order $order): RedirectResponse
    {
        if ($order->courier_consignment_id) {
            return redirect()->back()->with('error', 'This order has already been sent to Steadfast Courier.');
        }

        $response = $this->steadfastService->createConsignment($order);

        if (isset($response['status']) && $response['status'] == 200 && isset($response['consignment_id'])) {
            $consignmentId = $response['consignment_id'];
            $trackingCode = $response['tracking_code'] ?? null;

            $order->update([
                'courier_consignment_id' => $consignmentId,
                'courier_tracking_code' => $trackingCode,
                'courier_status' => 'in_review',
                'courier_error' => null,
            ]);

            CourierShipment::create([
                'order_id' => $order->id,
                'courier_name' => 'Steadfast',
                'consignment_id' => $consignmentId,
                'tracking_code' => $trackingCode,
                'status' => 'in_review',
                'response_json' => $response['raw_response'] ?? null,
            ]);

            // Update local order status if pending to processing/shipped
            if ($order->status === 'pending') {
                $order->update(['status' => 'processing']);
            }

            return redirect()->back()->with('success', 'Order sent to Steadfast Courier successfully! Consignment ID: '.$consignmentId);
        }

        $errorMessage = $response['message'] ?? 'Unknown error occurred while contacting Steadfast API.';
        $order->update([
            'courier_error' => $errorMessage,
        ]);

        return redirect()->back()->with('error', 'Failed to send to courier: '.$errorMessage);
    }

    /**
     * Synchronize delivery status with Steadfast Courier.
     */
    public function syncStatus(Order $order): RedirectResponse
    {
        if (! $order->courier_tracking_code) {
            return redirect()->back()->with('error', 'This order has not been dispatched to Steadfast Courier yet.');
        }

        $response = $this->steadfastService->trackShipment($order->courier_tracking_code);

        if (isset($response['status']) && $response['status'] == 200 && isset($response['delivery_status'])) {
            $newCourierStatus = $response['delivery_status'];

            $order->update([
                'courier_status' => $newCourierStatus,
                'courier_error' => null,
            ]);

            $shipment = CourierShipment::where('order_id', $order->id)->where('courier_name', 'Steadfast')->latest()->first();
            if ($shipment) {
                $shipment->update(['status' => $newCourierStatus]);
                $shipment->trackingLogs()->create([
                    'status' => $newCourierStatus,
                    'tracked_at' => now(),
                ]);
            }

            // Automatically transition internal order status based on courier updates
            if (in_array($newCourierStatus, ['delivered'])) {
                $order->update(['status' => 'delivered']);
            } elseif (in_array($newCourierStatus, ['cancelled'])) {
                $order->update(['status' => 'cancelled']);
            }

            return redirect()->back()->with('success', 'Courier status synchronized successfully: '.ucwords(str_replace('_', ' ', $newCourierStatus)));
        }

        $errorMessage = $response['message'] ?? 'Could not fetch delivery status.';

        return redirect()->back()->with('error', 'Failed to synchronize: '.$errorMessage);
    }
}
