<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BotConversation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BotInboxController extends Controller
{
    public function index(Request $request)
    {
        $conversations = BotConversation::latest('last_message_at')
            ->when($request->status === 'unresolved', fn($q) => $q->where('is_resolved', false))
            ->paginate(20);

        return Inertia::render('admin/bot-inbox/index', [
            'conversations' => $conversations,
            'filters' => $request->only('status'),
        ]);
    }

    public function update(Request $request, BotConversation $conversation)
    {
        $validated = $request->validate([
            'is_resolved' => 'required|boolean',
            'reply' => 'nullable|string',
        ]);

        if ($request->filled('reply')) {
            $messages = $conversation->messages;
            $messages[] = [
                'role' => 'admin',
                'content' => $validated['reply'],
                'timestamp' => now()->toIso8601String(),
            ];

            $conversation->update([
                'messages' => $messages,
                'last_message_at' => now(),
            ]);

            // Here we would actually send the message using WhatsAppService or Messenger API
            // For now, we just log it in the DB
        }

        if ($request->has('is_resolved')) {
            $conversation->update(['is_resolved' => $validated['is_resolved']]);
        }

        return redirect()->back();
    }
}
