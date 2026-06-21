<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhatsappCampaign;
use App\Models\WhatsappLog;
use App\Jobs\SendWhatsAppCampaignJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsAppCampaignController extends Controller
{
    public function index()
    {
        $campaigns = WhatsappCampaign::latest()->paginate(15);
        return Inertia::render('admin/whatsapp-campaigns/index', [
            'campaigns' => $campaigns
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_name' => 'required|string',
            'template_params' => 'nullable|array',
            'scheduled_at' => 'nullable|date',
            'audience_filter' => 'nullable|array',
        ]);

        $campaign = WhatsappCampaign::create($validated);

        // Dummy recipients logic
        $recipients = [
            ['phone' => '8801700000000'],
            ['phone' => '8801800000000'],
        ];

        foreach ($recipients as $recipient) {
            WhatsappLog::create([
                'whatsapp_campaign_id' => $campaign->id,
                'phone' => $recipient['phone'],
                'status' => 'pending'
            ]);
        }

        $campaign->update(['total_recipients' => count($recipients)]);

        if ($request->filled('scheduled_at')) {
            $campaign->update(['status' => 'scheduled']);
            dispatch(new SendWhatsAppCampaignJob($campaign))->delay(now()->parse($request->scheduled_at));
        } else {
            $campaign->update(['status' => 'sending']);
            dispatch(new SendWhatsAppCampaignJob($campaign));
        }

        return redirect()->back()->with('success', 'WhatsApp Campaign created successfully.');
    }
}
