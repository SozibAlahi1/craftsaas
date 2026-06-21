<?php

namespace App\Services;

use App\Models\BotConversation;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class BotService
{
    protected WhatsAppService $whatsapp;

    public function __construct(WhatsAppService $whatsapp)
    {
        $this->whatsapp = $whatsapp;
    }

    public function handleIncomingMessage(string $channel, string $senderId, string $messageText)
    {
        // Find or create conversation
        $conversation = BotConversation::firstOrCreate(
            ['channel' => $channel, 'sender_id' => $senderId],
            ['messages' => [], 'context' => [], 'is_resolved' => false]
        );

        $messages = $conversation->messages ?? [];
        $messages[] = ['role' => 'user', 'content' => $messageText, 'timestamp' => now()->toIso8601String()];
        
        $reply = $this->determineReply($senderId, $messageText);
        
        $messages[] = ['role' => 'bot', 'content' => $reply['text'], 'timestamp' => now()->toIso8601String()];
        
        $conversation->update([
            'messages' => $messages,
            'last_message_at' => now(),
            'is_resolved' => $reply['resolved'],
        ]);

        // Send reply via appropriate channel
        if ($channel === 'whatsapp') {
            $this->whatsapp->sendText($senderId, $reply['text']);
        } else if ($channel === 'messenger') {
            // Implement Messenger send API here
        }
    }

    protected function determineReply(string $senderId, string $message): array
    {
        $message = strtolower(trim($message));
        
        if (str_contains($message, 'order status') || str_contains($message, 'where is my order')) {
            // Try to find order by phone (assuming senderId is phone for WA)
            $phone = str_replace('+', '', $senderId);
            if (str_starts_with($phone, '88')) {
                $phone = substr($phone, 2);
            }
            
            $order = Order::where('customer_phone', 'like', "%{$phone}%")->latest()->first();
            
            if ($order) {
                return [
                    'text' => "Your recent order (#{$order->order_number}) is currently: " . ucfirst($order->status) . ".",
                    'resolved' => true,
                ];
            }
            
            return [
                'text' => "I couldn't find an order associated with this phone number. Please provide your order number.",
                'resolved' => false,
            ];
        }

        if (str_contains($message, 'track') || str_contains($message, 'tracking')) {
            return [
                'text' => "You can track your order using the link sent to you via SMS when it was shipped. If you need help, a human agent will be with you shortly.",
                'resolved' => false,
            ];
        }

        // Default / Escalation
        return [
            'text' => "Thanks for reaching out! A human agent will respond to your query shortly.",
            'resolved' => false, // Leaves the conversation open for human admin to reply
        ];
    }
}
