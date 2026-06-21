<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourierShipment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CourierWebhookController extends Controller
{
    /**
     * Handle incoming webhooks from Steadfast Courier.
     */
    public function steadfast(Request $request)
    {
        Log::info('Steadfast Webhook Received', $request->all());

        // Validate basic payload structure based on typical Steadfast webhook
        $consignmentId = $request->input('consignment_id');
        $trackingCode = $request->input('tracking_code');
        $status = $request->input('status'); // e.g., 'delivered', 'returned', 'shipped'

        if (!$trackingCode || !$status) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $shipment = CourierShipment::where('tracking_code', $trackingCode)->first();
        
        if (!$shipment) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }

        // Create tracking log
        $shipment->trackingLogs()->create([
            'status' => $status,
            'remarks' => 'Webhook update',
            'tracked_at' => now(),
        ]);

        // Update shipment status
        $shipment->update(['status' => $status]);

        // Update order status
        $order = $shipment->order;
        if ($order) {
            $order->update([
                'courier_status' => $status,
                'courier_error' => null,
            ]);

            // Auto-transition internal status based on courier status
            $this->autoTransitionOrderStatus($order, $status);
        }

        return response()->json(['message' => 'Success']);
    }

    /**
     * Auto transition internal order status based on external courier status.
     */
    protected function autoTransitionOrderStatus(Order $order, string $courierStatus)
    {
        $courierStatus = strtolower($courierStatus);

        if (in_array($courierStatus, ['delivered', 'partial_delivered'])) {
            $order->update(['status' => 'delivered']);
            
            $order->statusLogs()->create([
                'status' => 'delivered',
                'changed_by' => null, // System
            ]);
            
        } elseif (in_array($courierStatus, ['returned', 'cancelled', 'rejected'])) {
            $order->update(['status' => 'cancelled']);
            
            $order->statusLogs()->create([
                'status' => 'cancelled',
                'changed_by' => null, // System
            ]);
            
        } elseif (in_array($courierStatus, ['shipped', 'in_transit'])) {
            if ($order->status !== 'shipped') {
                $order->update(['status' => 'shipped']);
                
                $order->statusLogs()->create([
                    'status' => 'shipped',
                    'changed_by' => null, // System
                ]);
            }
        }
    }
}
