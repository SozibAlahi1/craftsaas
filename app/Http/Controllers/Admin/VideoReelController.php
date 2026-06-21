<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\VideoReel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoReelController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/video-reels/index', [
            'reels' => VideoReel::with(['product', 'category'])->orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/video-reels/create', [
            'products' => Product::all(['id', 'name', 'price']),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'youtube_id' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'category_id' => 'nullable|exists:categories,id',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        VideoReel::create($validated);

        return redirect()->route('admin.video-reels.index')
            ->with('success', 'Video reel created successfully.');
    }

    public function edit(VideoReel $videoReel)
    {
        return Inertia::render('admin/video-reels/edit', [
            'reel' => $videoReel,
            'products' => Product::all(['id', 'name', 'price']),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, VideoReel $videoReel)
    {
        $validated = $request->validate([
            'youtube_id' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'category_id' => 'nullable|exists:categories,id',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $videoReel->update($validated);

        return redirect()->route('admin.video-reels.index')
            ->with('success', 'Video reel updated successfully.');
    }

    public function destroy(VideoReel $videoReel)
    {
        $videoReel->delete();

        return redirect()->route('admin.video-reels.index')
            ->with('success', 'Video reel deleted successfully.');
    }
}
