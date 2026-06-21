<?php

namespace App\Services\Contracts;

use App\Models\Order;

interface CallServiceInterface
{
    /**
     * Initiate a voice call for the given order.
     *
     * @param Order $order
     * @return array Returns an array with at least 'call_id' and 'status'
     */
    public function initiateCall(Order $order): array;

    /**
     * Get the status of an existing call.
     *
     * @param string $callId
     * @return array
     */
    public function getCallStatus(string $callId): array;
}
