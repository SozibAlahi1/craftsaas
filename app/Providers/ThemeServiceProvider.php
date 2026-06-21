<?php

namespace App\Providers;

use App\Services\ThemeService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class ThemeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ThemeService::class, function ($app) {
            return new ThemeService();
        });
    }

    public function boot(ThemeService $themeService): void
    {
        $active = $themeService->getActiveTheme();

        // If theme has views, prepend them to Laravel view paths so themes can override core views.
        $themeViews = $themeService->themeViewPath($active);
        if (is_dir($themeViews)) {
            $paths = config('view.paths', []);
            // Prepend so the theme path is searched first.
            array_unshift($paths, $themeViews);
            config(['view.paths' => $paths]);
        }

        // Share active theme name with Blade views
        View::share('active_theme', $active);
    }
}
