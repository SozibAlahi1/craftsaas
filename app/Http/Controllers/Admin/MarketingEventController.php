<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendMarketingEventJob;
use App\Models\MarketingEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingEventController extends Controller
{
    /**
     * Display a listing of marketing events.
     */
    public function index(Request $request): Response
    {
        $query = MarketingEvent::with('order');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('order', function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'sent') {
                $query->where('sent', true);
            } else {
                $query->where('sent', false);
            }
        }

        $events = $query->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/marketing-events/index', [
            'events' => $events,
            'filters' => $request->only(['search', 'platform', 'status']),
        ]);
    }

    /**
     * Retry sending a failed marketing event.
     */
    public function retry(MarketingEvent $event): RedirectResponse
    {
        $event->update([
            'sent' => false,
            'response' => null,
        ]);

        SendMarketingEventJob::dispatch($event->id);

        return back()->with('success', 'Marketing event rescheduled for sending.');
    }

    /**
     * Force resend a marketing event manually.
     */
    public function resend(MarketingEvent $event): RedirectResponse
    {
        $event->update([
            'sent' => false,
            'response' => null,
            'retry_count' => 0,
        ]);

        SendMarketingEventJob::dispatch($event->id);

        return back()->with('success', 'Marketing event queued for resending.');
    }
}
