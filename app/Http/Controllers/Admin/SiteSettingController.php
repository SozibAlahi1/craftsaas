<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\SteadfastService;
use App\Services\ThemeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function __construct(protected ThemeService $themeService) {}

    /**
     * Display the site settings form.
     */
    public function index(): Response
    {
        $settings = [
            'site_name' => SiteSetting::getValue('site_name', 'Believers'),
            'shipping_cost' => SiteSetting::getValue('shipping_cost', '60'),
            'footer_description' => SiteSetting::getValue('footer_description', 'One of the largest Islamic Lifestyle brands in Bangladesh'),
            'footer_facebook_url' => SiteSetting::getValue('footer_facebook_url', 'https://facebook.com'),
            'footer_youtube_url' => SiteSetting::getValue('footer_youtube_url', 'https://youtube.com'),
            'footer_phone' => SiteSetting::getValue('footer_phone', '09638090000'),
            'footer_email' => SiteSetting::getValue('footer_email', 'cc.believerssign@gmail.com'),
            'footer_address' => SiteSetting::getValue('footer_address', 'Shop-3/1, Eastern Plaza, Hatirpool, Dhaka, Dhaka, Bangladesh'),
            'footer_copyright' => SiteSetting::getValue('footer_copyright', '© 2026 Believers. All Rights Reserved'),
            'footer_account_links' => SiteSetting::getValue('footer_account_links', []),
            'footer_info_links' => SiteSetting::getValue('footer_info_links', []),
            'site_theme' => SiteSetting::getValue('site_theme', 'classic'),
            'site_logo_url' => SiteSetting::getValue('site_logo') ? Storage::disk('public')->url(SiteSetting::getValue('site_logo')) : '',
            'enable_ai_voice_confirmation' => filter_var(SiteSetting::getValue('enable_ai_voice_confirmation', false), FILTER_VALIDATE_BOOLEAN),
        ];

        // Courier configuration data
        $courierApiKey = SiteSetting::getValue('courier_api_key');
        $courierSecretKey = SiteSetting::getValue('courier_secret_key');
        $bdCourierApiKey = SiteSetting::getValue('bd_courier_api_key');

        $courierBalance = null;
        $courierBalanceError = null;
        if ($courierApiKey && $courierSecretKey) {
            $balanceInfo = app(SteadfastService::class)->getBalance();
            $courierBalance = $balanceInfo['current_balance'] ?? null;
            if (isset($balanceInfo['message']) && ! isset($balanceInfo['current_balance'])) {
                $courierBalanceError = $balanceInfo['message'];
            }
        }

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'courierApiKey' => $courierApiKey ?? '',
            'courierSecretKey' => $courierSecretKey ?? '',
            'courierBalance' => $courierBalance,
            'courierBalanceError' => $courierBalanceError,
            'bdCourierApiKey' => $bdCourierApiKey ?? '',
            'fraudSettings' => [
                'pathao_user' => SiteSetting::getValue('fraud_pathao_user', ''),
                'pathao_password' => SiteSetting::getValue('fraud_pathao_password', ''),
                'steadfast_user' => SiteSetting::getValue('fraud_steadfast_user', ''),
                'steadfast_password' => SiteSetting::getValue('fraud_steadfast_password', ''),
                'redx_phone' => SiteSetting::getValue('fraud_redx_phone', ''),
                'redx_password' => SiteSetting::getValue('fraud_redx_password', ''),
                'paperfly_user' => SiteSetting::getValue('fraud_paperfly_user', ''),
                'paperfly_password' => SiteSetting::getValue('fraud_paperfly_password', ''),
                'carrybee_phone' => SiteSetting::getValue('fraud_carrybee_phone', ''),
                'carrybee_password' => SiteSetting::getValue('fraud_carrybee_password', ''),
            ],
            'automationSettings' => [
                'sms_provider' => SiteSetting::getValue('sms_provider', 'mim_sms'),
                'mim_sms_api_key' => SiteSetting::getValue('mim_sms_api_key', ''),
                'mim_sms_sender_id' => SiteSetting::getValue('mim_sms_sender_id', ''),
                'banglalink_sms_username' => SiteSetting::getValue('banglalink_sms_username', ''),
                'banglalink_sms_password' => SiteSetting::getValue('banglalink_sms_password', ''),
                'banglalink_sms_shortcode' => SiteSetting::getValue('banglalink_sms_shortcode', ''),
                'whatsapp_token' => SiteSetting::getValue('whatsapp_token', ''),
                'whatsapp_phone_id' => SiteSetting::getValue('whatsapp_phone_id', ''),
                'whatsapp_verify_token' => SiteSetting::getValue('whatsapp_verify_token', ''),
                'google_drive_folder_id' => SiteSetting::getValue('google_drive_folder_id', ''),
            ],
            'availableThemes' => $this->themeService->listThemes(),
        ]);
    }

    /**
     * Update the site settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $availableSlugs = array_column($this->themeService->listThemes(), 'slug');
        $themeRule = count($availableSlugs) > 0
            ? 'sometimes|string|in:'.implode(',', $availableSlugs)
            : 'sometimes|string';

        $validated = $request->validate([
            'site_name' => 'required|string|max:100',
            'site_theme' => $themeRule,
            'shipping_cost' => 'required|numeric|min:0',
            'footer_description' => 'required|string|max:500',
            'footer_facebook_url' => 'nullable|url|max:255',
            'footer_youtube_url' => 'nullable|url|max:255',
            'footer_phone' => 'required|string|max:50',
            'footer_email' => 'required|email|max:100',
            'footer_address' => 'required|string|max:500',
            'footer_copyright' => 'required|string|max:255',
            'footer_account_links' => 'required|array',
            'footer_account_links.*.label' => 'required|string|max:100',
            'footer_account_links.*.url' => 'required|string|max:255',
            'footer_info_links' => 'required|array',
            'footer_info_links.*.label' => 'required|string|max:100',
            'footer_info_links.*.url' => 'required|string|max:255',
            'site_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'enable_ai_voice_confirmation' => 'nullable|boolean',
        ]);

        if ($request->hasFile('site_logo')) {
            $siteLogoPath = $request->file('site_logo')->store('site_logos', 'public');
            $existingLogoPath = SiteSetting::getValue('site_logo');

            if ($existingLogoPath && ! str_starts_with($existingLogoPath, 'http') && Storage::disk('public')->exists($existingLogoPath)) {
                Storage::disk('public')->delete($existingLogoPath);
            }

            SiteSetting::setValue('site_logo', $siteLogoPath);
        }

        foreach ($validated as $key => $value) {
            if ($key === 'site_logo') {
                continue;
            }

            SiteSetting::setValue($key, $value);
        }

        return redirect()->back()->with('success', 'Site settings updated successfully.');
    }

    /**
     * Update the Fraud Checker API credentials.
     */
    public function updateFraudSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pathao_user' => 'nullable|string|max:255',
            'pathao_password' => 'nullable|string|max:255',
            'steadfast_user' => 'nullable|string|max:255',
            'steadfast_password' => 'nullable|string|max:255',
            'redx_phone' => 'nullable|string|max:20',
            'redx_password' => 'nullable|string|max:255',
            'paperfly_user' => 'nullable|string|max:255',
            'paperfly_password' => 'nullable|string|max:255',
            'carrybee_phone' => 'nullable|string|max:20',
            'carrybee_password' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::setValue('fraud_'.$key, $value ?? '');
        }

        // Clear config cache so the fraud-checker package reads fresh values
        Artisan::call('config:clear');

        return redirect()->back()->with('success', 'Fraud Checker settings updated successfully.');
    }

    /**
     * Activate a specific theme by slug.
     * This is a lightweight endpoint that only updates site_theme,
     * without requiring all the other settings fields.
     */
    public function activateTheme(Request $request): RedirectResponse
    {
        $availableSlugs = array_column($this->themeService->listThemes(), 'slug');

        $validated = $request->validate([
            'slug' => ['required', 'string', 'in:'.implode(',', $availableSlugs)],
        ]);

        $this->themeService->setActiveTheme($validated['slug']);

        return redirect()->back()->with('success', 'Theme activated successfully.');
    }

    /**
     * Update Automation (SMS/WA/Backup) settings.
     */
    public function updateAutomationSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sms_provider' => 'required|string|in:mim_sms,banglalink_sms',
            'mim_sms_api_key' => 'nullable|string|max:255',
            'mim_sms_sender_id' => 'nullable|string|max:255',
            'banglalink_sms_username' => 'nullable|string|max:255',
            'banglalink_sms_password' => 'nullable|string|max:255',
            'banglalink_sms_shortcode' => 'nullable|string|max:255',
            'whatsapp_token' => 'nullable|string',
            'whatsapp_phone_id' => 'nullable|string|max:255',
            'whatsapp_verify_token' => 'nullable|string|max:255',
            'google_drive_folder_id' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::setValue($key, $value ?? '');
        }

        Artisan::call('config:clear');

        return redirect()->back()->with('success', 'Automation settings updated successfully.');
    }
}
