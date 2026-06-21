<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/banners/index', [
            'banners' => Banner::orderBy('order')->get()->map(function (Banner $b) {
                return [
                    'id'        => $b->id,
                    'title'     => $b->title,
                    'image_url' => $b->image_url,
                    'link'      => $b->link,
                    'order'     => $b->order,
                    'is_active' => $b->is_active,
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/banners/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'     => 'nullable|string|max:255',
            'image'     => 'required|mimes:jpg,jpeg,png,webp,svg,avif|max:5120',
            'link'      => 'nullable|string|max:255',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $path = $request->file('image')->store('banners', 'public');

        Banner::create([
            'title'      => $validated['title'] ?? null,
            'image_path' => $path,
            'link'       => $validated['link'] ?? null,
            'order'      => $validated['order'] ?? 0,
            'is_active'  => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/banners/edit', [
            'banner' => [
                'id'        => $banner->id,
                'title'     => $banner->title,
                'image_url' => $banner->image_url,
                'link'      => $banner->link,
                'order'     => $banner->order,
                'is_active' => $banner->is_active,
            ],
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title'     => 'nullable|string|max:255',
            'image'     => 'nullable|mimes:jpg,jpeg,png,webp,svg,avif|max:5120',
            'link'      => 'nullable|string|max:255',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $updateData = [
            'title'     => $validated['title'] ?? null,
            'link'      => $validated['link'] ?? null,
            'order'     => $validated['order'] ?? $banner->order,
            'is_active' => $validated['is_active'] ?? $banner->is_active,
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($banner->image_path) {
                Storage::disk('public')->delete($banner->image_path);
            }
            $updateData['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($updateData);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image_path) {
            Storage::disk('public')->delete($banner->image_path);
        }
        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }
}
