<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\FeaturedTile;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::where('show_on_home', true)
            ->with([
                'products' => function ($query) {
                    $query->latest()->take(5);
                },
                'videoReels' => function ($query) {
                    $query->where('is_active', true)->with('product')->orderBy('order');
                },
            ])
            ->get();

        $featuredTiles = FeaturedTile::where('is_active', true)
            ->orderBy('order')
            ->get();

        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn(Banner $b) => [
                'id'        => $b->id,
                'title'     => $b->title,
                'image_url' => $b->image_url,
                'link'      => $b->link,
            ]);

        return Inertia::render('home', [
            'homeCategories' => $categories,
            'featuredTiles'  => $featuredTiles,
            'banners'        => $banners,
        ]);
    }
}
