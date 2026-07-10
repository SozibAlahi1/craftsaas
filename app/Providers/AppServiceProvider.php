<?php

namespace App\Providers;

use App\Events\OrderStatusChanged;
use App\Listeners\SendMarketingConversionEvents;
use App\Models\Order;
use App\Observers\OrderEventObserver;
use App\Services\Contracts\CallServiceInterface;
use App\Services\Contracts\CourierServiceInterface;
use App\Services\Couriers\SteadfastCourierService;
use App\Services\DummyCallService;
use App\Services\Marketing\MarketingService;
use App\Services\Marketing\Providers\GoogleAdsProvider;
use App\Services\Marketing\Providers\GoogleAnalyticsProvider;
use App\Services\Marketing\Providers\MetaProvider;
use App\Services\Marketing\Providers\SnapchatProvider;
use App\Services\Marketing\Providers\TikTokProvider;
use App\Services\Marketing\Providers\WebhookProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CourierServiceInterface::class, SteadfastCourierService::class);
        $this->app->bind(CallServiceInterface::class, DummyCallService::class);

        $this->app->singleton(MarketingService::class, function ($app) {
            return new MarketingService([
                $app->make(MetaProvider::class),
                $app->make(GoogleAdsProvider::class),
                $app->make(GoogleAnalyticsProvider::class),
                $app->make(TikTokProvider::class),
                $app->make(SnapchatProvider::class),
                $app->make(WebhookProvider::class),
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Order::observe(OrderEventObserver::class);

        Event::listen(
            OrderStatusChanged::class,
            SendMarketingConversionEvents::class
        );
    }
}
