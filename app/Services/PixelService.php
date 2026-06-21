<?php

namespace App\Services;

use App\Models\Pixel;
use Illuminate\Support\Facades\Cache;

class PixelService
{
    /**
     * Get active pixels formatted for frontend injection.
     */
    public function getActivePixels(): array
    {
        // Cache for 1 hour, flush on pixel update
        return Cache::remember('active_pixels', 3600, function () {
            return Pixel::where('is_active', true)
                ->get()
                ->map(function ($pixel) {
                    return [
                        'id' => $pixel->id,
                        'pixel_id' => $pixel->pixel_id,
                        // DO NOT include access_token here to prevent frontend exposure
                    ];
                })->toArray();
        });
    }

    /**
     * Clear the pixel cache.
     */
    public function clearCache(): void
    {
        Cache::forget('active_pixels');
    }
}
