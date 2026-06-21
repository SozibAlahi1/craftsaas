<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class LandingPageController extends Controller
{
    public function show(string $slug)
    {
        // Cache rendered output for 5 minutes (300 seconds)
        $landingPage = Cache::remember("lp.{$slug}", 300, function () use ($slug) {
            return LandingPage::with('sections')->where('slug', $slug)->where('status', 'published')->firstOrFail();
        });

        // We can pass the page to an Inertia React View
        // Note: For extreme speed, we could compile this to raw blade, but requirement states "full React SPA within Inertia"
        return Inertia::render('storefront/landing-page/show', [
            'page' => $landingPage
        ]);
    }
}
