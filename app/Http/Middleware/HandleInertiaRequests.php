<?php

namespace App\Http\Middleware;

use App\Models\MenuItem;
use App\Models\SiteSetting;
use App\Services\PixelService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'pixels' => app(PixelService::class)->getActivePixels(),
            'cart' => $request->session()->get('cart', []),
            'cartCount' => collect($request->session()->get('cart', []))->sum('quantity'),
            'menus' => MenuItem::whereNull('parent_id')
                ->with(['children' => function ($query) {
                    $query->with('category')->orderBy('order')->orderBy('id');
                }, 'category'])
                ->orderBy('order')
                ->orderBy('id')
                ->get(),
            'settings' => [
                'site_name' => SiteSetting::getValue('site_name', 'Shutki Valley'),
                'shipping_cost' => SiteSetting::getValue('shipping_cost', '60'),
                'footer_description' => SiteSetting::getValue('footer_description', 'বাংলাদেশের সেরা শুকটি মাছের অনলাইন বাজার। তাজা ও মানসম্পন্ন শুকটি মাছ সরাসরি আপনার দরজায়।'),
                'footer_facebook_url' => SiteSetting::getValue('footer_facebook_url', 'https://facebook.com'),
                'footer_youtube_url' => SiteSetting::getValue('footer_youtube_url', 'https://youtube.com'),
                'footer_phone' => SiteSetting::getValue('footer_phone', '01700000000'),
                'footer_email' => SiteSetting::getValue('footer_email', 'info@shutkivalley.com'),
                'footer_address' => SiteSetting::getValue('footer_address', 'শুটকি ভ্যালী, কক্সবাজার, বাংলাদেশ'),
                'footer_copyright' => SiteSetting::getValue('footer_copyright', '© 2026 Shutki Valley. All Rights Reserved'),
                'footer_account_links' => SiteSetting::getValue('footer_account_links', []),
                'footer_info_links' => SiteSetting::getValue('footer_info_links', []),
                'site_theme' => SiteSetting::getValue('site_theme', 'classic'),
                'site_logo_url' => SiteSetting::getValue('site_logo') ? (str_starts_with(SiteSetting::getValue('site_logo'), 'http') ? SiteSetting::getValue('site_logo') : '/storage/'.SiteSetting::getValue('site_logo')) : '',
                'site_favicon_url' => SiteSetting::getValue('site_favicon') ? (str_starts_with(SiteSetting::getValue('site_favicon'), 'http') ? SiteSetting::getValue('site_favicon') : '/storage/'.SiteSetting::getValue('site_favicon')) : '',
                'gtm_container_id' => SiteSetting::getValue('gtm_container_id', ''),
            ],
        ]);
    }
}
