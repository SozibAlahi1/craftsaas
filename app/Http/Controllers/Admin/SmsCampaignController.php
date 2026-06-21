<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmsCampaign;
use App\Models\SmsLog;
use App\Jobs\SendSMSCampaignJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsCampaignController extends Controller
{
    public function index()
    {
        $campaigns = SmsCampaign::latest()->paginate(15);
        return Inertia::render('admin/sms-campaigns/index', [
            'campaigns' => $campaigns
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message_template' => 'required|string',
            'audience_type' => 'required|in:all,segment,custom',
            'scheduled_at' => 'nullable|date',
            'audience_filter' => 'nullable|array',
        ]);

        $campaign = SmsCampaign::create($validated);

        // Dummy logic to simulate loading recipients
        // Real app would query users based on audience_filter
        $recipients = [
            ['phone' => '01700000000'],
            ['phone' => '01800000000'],
        ];

        foreach ($recipients as $recipient) {
            SmsLog::create([
                'sms_campaign_id' => $campaign->id,
                'phone' => $recipient['phone'],
                'message' => $campaign->message_template,
                'status' => 'pending'
            ]);
        }

        $campaign->update(['total_recipients' => count($recipients)]);

        if ($request->filled('scheduled_at')) {
            $campaign->update(['status' => 'scheduled']);
            dispatch(new SendSMSCampaignJob($campaign))->delay(now()->parse($request->scheduled_at));
        } else {
            $campaign->update(['status' => 'sending']);
            dispatch(new SendSMSCampaignJob($campaign));
        }

        return redirect()->back()->with('success', 'SMS Campaign created successfully.');
    }
}
