<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class LandingPageController extends Controller
{
    public function index()
    {
        $pages = LandingPage::latest()->paginate(20);
        return Inertia::render('admin/landing-pages/index', ['pages' => $pages]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $slug = Str::slug($validated['title']) . '-' . rand(1000, 9999);

        $page = LandingPage::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'status' => 'draft',
            'settings' => [
                'theme' => 'light',
                'font' => 'inter',
            ],
        ]);

        return redirect()->route('admin.landing-pages.builder', $page);
    }

    public function builder(LandingPage $landingPage)
    {
        $landingPage->load('sections');
        return Inertia::render('admin/landing-pages/builder', [
            'page' => $landingPage
        ]);
    }

    public function saveBuilder(Request $request, LandingPage $landingPage)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
            'settings' => 'nullable|array',
            'meta' => 'nullable|array',
        ]);

        // Update page settings & meta
        $landingPage->update([
            'settings' => $validated['settings'] ?? $landingPage->settings,
            'meta' => $validated['meta'] ?? $landingPage->meta,
        ]);

        // Sync sections
        // Delete all old sections and recreate to ensure clean sync (simple approach for builder)
        $landingPage->sections()->delete();

        foreach ($validated['sections'] as $index => $section) {
            $landingPage->sections()->create([
                'type' => $section['type'],
                'sort_order' => $index,
                'content' => $section['content'] ?? [],
                'styles' => $section['styles'] ?? [],
            ]);
        }

        return response()->json(['message' => 'Saved successfully']);
    }

    public function publish(Request $request, LandingPage $landingPage)
    {
        $landingPage->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
        return redirect()->back()->with('success', 'Page published! Public URL is ready.');
    }

    public function destroy(LandingPage $landingPage)
    {
        $landingPage->delete();
        return redirect()->route('admin.landing-pages.index')->with('success', 'Landing page deleted.');
    }
}
