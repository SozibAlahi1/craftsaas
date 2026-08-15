<?php

use App\Jobs\AbandonedCartJob;
use App\Jobs\BackupJob;
use App\Jobs\RecalculateProfitJob;
use App\Services\MetaAdsService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    app(MetaAdsService::class)->syncDailySpend();
    dispatch(new RecalculateProfitJob);
})->dailyAt('02:00');

Schedule::call(function () {
    dispatch(new BackupJob);
})->dailyAt('03:00');

Schedule::job(new AbandonedCartJob)->hourly();
