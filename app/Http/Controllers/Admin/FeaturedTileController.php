<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FeaturedTile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeaturedTileController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/featured-tiles/index', [
            'tiles' => FeaturedTile::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/featured-tiles/create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:2048',
            'link' => 'nullable|string|max:255',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('featured-tiles', 'public');
            $validated['image'] = '/storage/'.$path;
        }

        FeaturedTile::create($validated);

        return redirect()->route('admin.featured-tiles.index')
            ->with('success', 'Featured tile created successfully.');
    }

    public function edit(FeaturedTile $featuredTile)
    {
        return Inertia::render('admin/featured-tiles/edit', [
            'tile' => $featuredTile,
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, FeaturedTile $featuredTile)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'link' => 'nullable|string|max:255',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('featured-tiles', 'public');
            $validated['image'] = '/storage/'.$path;
        } else {
            unset($validated['image']);
        }

        $featuredTile->update($validated);

        return redirect()->route('admin.featured-tiles.index')
            ->with('success', 'Featured tile updated successfully.');
    }

    public function destroy(FeaturedTile $featuredTile)
    {
        $featuredTile->delete();

        return redirect()->route('admin.featured-tiles.index')
            ->with('success', 'Featured tile deleted successfully.');
    }
}
