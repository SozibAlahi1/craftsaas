<?php

use App\Http\Controllers\Admin\AbandonedCartController;
use App\Http\Controllers\Admin\AdCopyController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BlockedCustomerController;
use App\Http\Controllers\Admin\BotInboxController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CheckoutTemplateController;
use App\Http\Controllers\Admin\CourierController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\FeaturedTileController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\MetaAdsController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PixelController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SmsCampaignController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\ThankYouTemplateController;
use App\Http\Controllers\Admin\VideoReelController;
use App\Http\Controllers\Admin\WhatsAppCampaignController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\OrderTrackingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/lp/{slug}', [LandingPageController::class, 'show'])->name('landing-pages.show');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('products.reviews.store');
Route::get('/api/search', [ProductController::class, 'search'])->name('api.products.search');

Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/buy-now', [CartController::class, 'buyNow'])->name('cart.buyNow');
Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');

Route::prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/', [CheckoutController::class, 'store'])->name('store');
    Route::post('/save-contact', [CheckoutController::class, 'saveContact'])->name('save-contact');
    Route::get('/thank-you', [CheckoutController::class, 'thankYou'])->name('thank-you');
});

Route::get('/track-order', [OrderTrackingController::class, 'index'])->name('track-order');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::redirect('admin', 'admin/products');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('banners', BannerController::class)->except(['show']);

        Route::resource('products', App\Http\Controllers\Admin\ProductController::class);

        Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');

        Route::resource('settings', SiteSettingController::class)->only(['index', 'store']);

        // Analytics
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

        // Finance & Profit Tracking
        Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
        Route::get('/finance/export', [FinanceController::class, 'exportCsv'])->name('finance.export');

        // Expenses
        Route::resource('expenses', ExpenseController::class)->only(['index', 'store', 'destroy']);

        // Meta Ads Management
        Route::get('/meta-ads', [MetaAdsController::class, 'index'])->name('meta-ads.index');
        Route::post('/meta-ads/accounts', [MetaAdsController::class, 'storeAccount'])->name('meta-ads.accounts.store');
        Route::post('/meta-ads/sync', [MetaAdsController::class, 'syncData'])->name('meta-ads.sync');

        // Automation (SMS & WhatsApp)
        Route::resource('sms-campaigns', SmsCampaignController::class)->only(['index', 'store']);
        Route::resource('whatsapp-campaigns', WhatsAppCampaignController::class)->only(['index', 'store']);

        // Bot Inbox
        Route::resource('bot-inbox', BotInboxController::class)->only(['index', 'update']);

        // AI Ad Copies
        Route::get('ad-copies', [AdCopyController::class, 'index'])->name('ad-copies.index');
        Route::post('ad-copies/generate', [AdCopyController::class, 'generate'])->name('ad-copies.generate');
        Route::delete('ad-copies/{adCopy}', [AdCopyController::class, 'destroy'])->name('ad-copies.destroy');

        // Landing Pages Builder
        Route::resource('landing-pages', App\Http\Controllers\Admin\LandingPageController::class)->except(['show', 'edit', 'update']);
        Route::get('landing-pages/{landingPage}/builder', [App\Http\Controllers\Admin\LandingPageController::class, 'builder'])->name('landing-pages.builder');
        Route::post('landing-pages/{landingPage}/save', [App\Http\Controllers\Admin\LandingPageController::class, 'saveBuilder'])->name('landing-pages.save');
        Route::post('landing-pages/{landingPage}/publish', [App\Http\Controllers\Admin\LandingPageController::class, 'publish'])->name('landing-pages.publish');

        // Checkout & Thank You Builder
        Route::resource('checkout-templates', CheckoutTemplateController::class);
        Route::resource('thank-you-templates', ThankYouTemplateController::class);

        // Backups
        Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
        Route::post('/backups', [BackupController::class, 'store'])->name('backups.store');
        Route::get('/backups/{backup}/download', [BackupController::class, 'download'])->name('backups.download');

        Route::resource('pixels', PixelController::class)->except(['create', 'edit', 'show']);
        Route::post('pixels/{pixel}/toggle', [PixelController::class, 'toggleStatus'])->name('pixels.toggle');

        Route::get('stocks', [StockController::class, 'index'])->name('stocks.index');
        Route::post('stocks/{product}', [StockController::class, 'update'])->name('stocks.update');
        Route::post('stocks/variant/{variant}', [StockController::class, 'updateVariant'])->name('stocks.variant.update');

        Route::patch('orders/bulk-update', [OrderController::class, 'bulkUpdate'])->name('orders.bulk-update');
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('orders/{order}/print/{size}', [OrderController::class, 'print'])->name('orders.print');
        Route::get('orders/{order}/sync-courier', [CourierController::class, 'syncStatus'])->name('orders.sync-courier');
        Route::get('abandoned-carts', [AbandonedCartController::class, 'index'])->name('abandoned-carts.index');
        Route::post('abandoned-carts/{cart}/mark-recovered', [AbandonedCartController::class, 'markRecovered'])->name('abandoned-carts.mark-recovered');
        Route::delete('abandoned-carts/{cart}', [AbandonedCartController::class, 'destroy'])->name('abandoned-carts.destroy');
        Route::get('blocked-customers', [BlockedCustomerController::class, 'index'])->name('blocked-customers.index');
        Route::post('blocked-customers', [BlockedCustomerController::class, 'store'])->name('blocked-customers.store');
        Route::delete('blocked-customers/{blockedCustomer}', [BlockedCustomerController::class, 'destroy'])->name('blocked-customers.destroy');

        Route::get('leads', [LeadController::class, 'index'])->name('leads.index');
        Route::post('leads/import', [LeadController::class, 'import'])->name('leads.import');
        Route::get('leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
        Route::patch('leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
        Route::post('leads/{lead}/activities', [LeadController::class, 'addActivity'])->name('leads.activities.store');

        Route::resource('featured-tiles', FeaturedTileController::class);
        Route::resource('video-reels', VideoReelController::class);
        Route::resource('menu-items', MenuItemController::class);

        Route::get('settings', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [SiteSettingController::class, 'update'])->name('settings.update');
        Route::post('settings/courier', [SiteSettingController::class, 'updateCourierSettings'])->name('settings.courier.update');
        Route::post('settings/fraud', [SiteSettingController::class, 'updateFraudSettings'])->name('settings.fraud.update');
        Route::post('settings/theme/activate', [SiteSettingController::class, 'activateTheme'])->name('settings.theme.activate');
        Route::post('settings/automation', [SiteSettingController::class, 'updateAutomationSettings'])->name('settings.automation.update');
        Route::post('settings/gtm', [SiteSettingController::class, 'updateGtmSettings'])->name('settings.gtm.update');

        Route::get('courier-configure', [CourierController::class, 'index'])->name('courier.index');
        Route::post('courier-configure', [CourierController::class, 'updateSettings'])->name('courier.update');
        Route::post('orders/{order}/send-courier', [CourierController::class, 'sendToCourier'])->name('orders.send-courier');
        Route::post('orders/{order}/sync-courier', [CourierController::class, 'syncStatus'])->name('orders.sync-courier');
        Route::post('orders/{order}/fraud-check', [OrderController::class, 'fraudCheck'])->name('orders.fraud-check');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
