<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Services\Contracts\CourierServiceInterface::class, \App\Services\Couriers\SteadfastCourierService::class);
        $this->app->bind(\App\Services\Contracts\CallServiceInterface::class, \App\Services\DummyCallService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        \App\Models\Order::observe(\App\Observers\OrderEventObserver::class);
    }
}
