<?php

namespace App\Services;

use App\Models\AnalyticsEvent;
use App\Models\CustomerJourney;

class AnalyticsService
{
    /**
     * Track an internal analytics event.
     */
    public function track(string $eventName, array $properties = [], ?int $userId = null, ?string $sessionId = null, ?string $pageUrl = null, ?string $referrer = null): void
    {
        AnalyticsEvent::create([
            'event_name' => $eventName,
            'user_id' => $userId,
            'session_id' => $sessionId ?? session()->getId(),
            'page_url' => $pageUrl ?? request()->fullUrl(),
            'referrer' => $referrer ?? request()->header('referer'),
            'properties' => $properties,
        ]);

        $this->updateJourney($sessionId ?? session()->getId(), $userId, $eventName, $properties);
    }

    /**
     * Update customer journey.
     */
    private function updateJourney(string $sessionId, ?int $userId, string $eventName, array $properties): void
    {
        $journey = CustomerJourney::firstOrCreate(
            ['session_id' => $sessionId],
            ['user_id' => $userId, 'steps' => []]
        );

        $steps = $journey->steps ?? [];
        $steps[] = [
            'event' => $eventName,
            'time' => now()->toDateTimeString(),
            'properties' => $properties,
        ];

        $updates = ['steps' => $steps];
        
        if ($eventName === 'Purchase' && isset($properties['order_id'])) {
            $updates['converted'] = true;
            $updates['order_id'] = $properties['order_id'];
        }

        // If user logged in during session
        if ($userId && !$journey->user_id) {
            $updates['user_id'] = $userId;
        }

        $journey->update($updates);
    }
}
