<?php

namespace App\Services;

use App\Models\Order;
use App\Services\Contracts\CallServiceInterface;
use Illuminate\Support\Str;

class DummyCallService implements CallServiceInterface
{
    /**
     * Simulate initiating a voice call.
     */
    public function initiateCall(Order $order): array
    {
        // In a real implementation, you would call the AI Voice Provider's API here.
        // e.g. Http::post('https://api.bland.ai/v1/calls', [...])
        
        return [
            'provider' => 'dummy_ai',
            'call_id' => 'call_' . Str::random(16),
            'status' => 'initiated',
        ];
    }

    /**
     * Simulate getting call status.
     */
    public function getCallStatus(string $callId): array
    {
        return [
            'status' => 'completed',
            'duration' => rand(20, 120),
            'recording_url' => 'https://dummy-recording-url.com/' . $callId . '.mp3',
        ];
    }
}
