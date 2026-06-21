<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pixel;
use App\Services\PixelService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PixelController extends Controller
{
    public function index()
    {
        $pixels = Pixel::latest()->get();
        return Inertia::render('admin/pixels/index', compact('pixels'));
    }

    public function store(Request $request, PixelService $pixelService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pixel_id' => 'required|string|max:255',
            'access_token' => 'nullable|string',
            'is_active' => 'boolean',
            'test_event_code' => 'nullable|string|max:255',
        ]);

        Pixel::create($validated);
        $pixelService->clearCache();

        return back()->with('success', 'Pixel added successfully.');
    }

    public function update(Request $request, Pixel $pixel, PixelService $pixelService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pixel_id' => 'required|string|max:255',
            'access_token' => 'nullable|string',
            'is_active' => 'boolean',
            'test_event_code' => 'nullable|string|max:255',
        ]);

        $pixel->update($validated);
        $pixelService->clearCache();

        return back()->with('success', 'Pixel updated successfully.');
    }

    public function destroy(Pixel $pixel, PixelService $pixelService)
    {
        $pixel->delete();
        $pixelService->clearCache();

        return back()->with('success', 'Pixel deleted successfully.');
    }

    public function toggleStatus(Pixel $pixel, PixelService $pixelService)
    {
        $pixel->update(['is_active' => !$pixel->is_active]);
        $pixelService->clearCache();

        return back()->with('success', 'Pixel status toggled.');
    }
}
