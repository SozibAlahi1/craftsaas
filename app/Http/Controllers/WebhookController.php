<?php

namespace App\Http\Controllers;

use App\Services\BotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected BotService $botService;

    public function __construct(BotService $botService)
    {
        $this->botService = $botService;
    }

    public function verifyWhatsapp(Request $request)
    {
        $verifyToken = config('services.whatsapp.verify_token');
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        if ($mode && $token) {
            if ($mode === 'subscribe' && $token === $verifyToken) {
                return response($challenge, 200);
            }
        }
        return response('Forbidden', 403);
    }

    public function handleWhatsapp(Request $request)
    {
        // Simple signature check logic could be added here
        
        $body = $request->all();

        if (isset($body['object']) && $body['object'] === 'whatsapp_business_account') {
            foreach ($body['entry'] as $entry) {
                foreach ($entry['changes'] as $change) {
                    if (isset($change['value']['messages'])) {
                        foreach ($change['value']['messages'] as $message) {
                            $from = $message['from'];
                            $text = $message['text']['body'] ?? '';

                            if ($text) {
                                $this->botService->handleIncomingMessage('whatsapp', $from, $text);
                            }
                        }
                    }
                }
            }
            return response('EVENT_RECEIVED', 200);
        }

        return response('Not Found', 404);
    }
}
