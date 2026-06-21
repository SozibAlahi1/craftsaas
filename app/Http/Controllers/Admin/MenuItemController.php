<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the menu items.
     */
    public function index(): Response
    {
        $menuItems = MenuItem::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->with('category')->orderBy('order')->orderBy('id');
            }, 'category'])
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/menu-items/index', [
            'menuItems' => $menuItems,
        ]);
    }

    /**
     * Show the form for creating a new menu item.
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        $parentItems = MenuItem::whereNull('parent_id')
            ->orderBy('order')
            ->orderBy('id')
            ->get(['id', 'title']);

        return Inertia::render('admin/menu-items/create', [
            'categories' => $categories,
            'parentItems' => $parentItems,
        ]);
    }

    /**
     * Store a newly created menu item in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:custom,category',
            'url' => 'required_if:type,custom|nullable|string|max:255',
            'category_id' => 'required_if:type,category|nullable|exists:categories,id',
            'parent_id' => 'nullable|exists:menu_items,id',
            'order' => 'integer',
        ]);

        // If it's a category link, empty out the custom url
        if ($validated['type'] === 'category') {
            $validated['url'] = null;
        } else {
            $validated['category_id'] = null;
        }

        MenuItem::create($validated);

        return redirect()->route('admin.menu-items.index')
            ->with('success', 'Menu item created successfully.');
    }

    /**
     * Show the form for editing the specified menu item.
     */
    public function edit(MenuItem $menuItem): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        // Parent items exclude self to prevent circular references
        $parentItems = MenuItem::whereNull('parent_id')
            ->where('id', '!=', $menuItem->id)
            ->orderBy('order')
            ->orderBy('id')
            ->get(['id', 'title']);

        return Inertia::render('admin/menu-items/edit', [
            'menuItem' => $menuItem,
            'categories' => $categories,
            'parentItems' => $parentItems,
        ]);
    }

    /**
     * Update the specified menu item in storage.
     */
    public function update(Request $request, MenuItem $menuItem): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:custom,category',
            'url' => 'required_if:type,custom|nullable|string|max:255',
            'category_id' => 'required_if:type,category|nullable|exists:categories,id',
            'parent_id' => 'nullable|exists:menu_items,id',
            'order' => 'integer',
        ]);

        // Prevent setting self as parent
        if (isset($validated['parent_id']) && (int) $validated['parent_id'] === $menuItem->id) {
            $validated['parent_id'] = null;
        }

        // If it's a category link, empty out the custom url
        if ($validated['type'] === 'category') {
            $validated['url'] = null;
        } else {
            $validated['category_id'] = null;
        }

        $menuItem->update($validated);

        return redirect()->route('admin.menu-items.index')
            ->with('success', 'Menu item updated successfully.');
    }

    /**
     * Remove the specified menu item from storage.
     */
    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $menuItem->delete();

        return redirect()->route('admin.menu-items.index')
            ->with('success', 'Menu item deleted successfully.');
    }
}
