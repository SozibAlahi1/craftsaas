<?php

namespace Tests\Feature\Admin;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SiteSettingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Guest users should be redirected to login.
     */
    public function test_guest_cannot_access_settings_index(): void
    {
        $response = $this->get(route('admin.settings.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Authenticated admins can access settings index and receive settings data.
     */
    public function test_admin_can_access_settings_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.settings.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/index')
            ->has('settings')
            ->where('settings.site_name', 'Believers')
            ->where('settings.site_theme', 'classic')
            ->where('settings.shipping_cost', '60')
            ->where('settings.footer_phone', '09638090000')
            ->where('settings.footer_email', 'cc.believerssign@gmail.com')
            ->where('settings.site_logo_url', '')
        );
    }

    /**
     * Admin can successfully update settings.
     */
    public function test_admin_can_update_settings(): void
    {
        $user = User::factory()->create();

        $payload = [
            'site_name' => 'Brand New Store',
            'site_theme' => 'modern',
            'shipping_cost' => '85',
            'footer_description' => 'A custom description that is dynamic!',
            'footer_facebook_url' => 'https://facebook.com/newbrandpage',
            'footer_youtube_url' => 'https://youtube.com/newbrandchannel',
            'footer_phone' => '0123456789',
            'footer_email' => 'cc.brandnew@gmail.com',
            'footer_address' => 'Floor 5, Elegant Mansion, Dhaka, Bangladesh',
            'footer_copyright' => '© 2026 Brand New. All Rights Reserved',
            'footer_account_links' => [
                ['label' => 'Dynamic Link 1', 'url' => '/dynamic-1'],
            ],
            'footer_info_links' => [
                ['label' => 'Dynamic Link 2', 'url' => '/dynamic-2'],
            ],
        ];

        $response = $this->actingAs($user)
            ->from(route('admin.settings.index'))
            ->post(route('admin.settings.update'), $payload);

        $response->assertRedirect(route('admin.settings.index'));
        $response->assertSessionHasNoErrors();

        // Assert database holds the new values
        $this->assertEquals('Brand New Store', SiteSetting::getValue('site_name'));
        $this->assertEquals('85', SiteSetting::getValue('shipping_cost'));
        $this->assertEquals('modern', SiteSetting::getValue('site_theme'));
        $this->assertEquals('A custom description that is dynamic!', SiteSetting::getValue('footer_description'));
        $this->assertEquals('https://facebook.com/newbrandpage', SiteSetting::getValue('footer_facebook_url'));
        $this->assertEquals('0123456789', SiteSetting::getValue('footer_phone'));
        $this->assertEquals('cc.brandnew@gmail.com', SiteSetting::getValue('footer_email'));

        $accountLinks = SiteSetting::getValue('footer_account_links');
        $this->assertCount(1, $accountLinks);
        $this->assertEquals('Dynamic Link 1', $accountLinks[0]['label']);
        $this->assertEquals('/dynamic-1', $accountLinks[0]['url']);
    }

    public function test_admin_can_upload_site_logo(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $logo = UploadedFile::fake()->image('logo.png');

        $payload = [
            'site_name' => 'Brand New Store',
            'shipping_cost' => '60',
            'footer_description' => 'A custom description that is dynamic!',
            'footer_facebook_url' => 'https://facebook.com/newbrandpage',
            'footer_youtube_url' => 'https://youtube.com/newbrandchannel',
            'footer_phone' => '0123456789',
            'footer_email' => 'cc.brandnew@gmail.com',
            'footer_address' => 'Floor 5, Elegant Mansion, Dhaka, Bangladesh',
            'footer_copyright' => '© 2026 Brand New. All Rights Reserved',
            'footer_account_links' => [
                ['label' => 'Dynamic Link 1', 'url' => '/dynamic-1'],
            ],
            'footer_info_links' => [
                ['label' => 'Dynamic Link 2', 'url' => '/dynamic-2'],
            ],
            'site_logo' => $logo,
        ];

        $response = $this->actingAs($user)
            ->from(route('admin.settings.index'))
            ->post(route('admin.settings.update'), $payload);

        $response->assertRedirect(route('admin.settings.index'));
        $response->assertSessionHasNoErrors();

        $logoPath = SiteSetting::getValue('site_logo');
        $this->assertNotEmpty($logoPath);
        Storage::disk('public')->assertExists($logoPath);
    }

    /**
     * Invalid settings input throws validation exception.
     */
    public function test_update_settings_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $payload = [
            'site_name' => '', // Required
            'shipping_cost' => 'not-a-number', // Must be numeric
            'footer_description' => '', // Required
            'footer_facebook_url' => 'invalid-url', // Must be URL
            'footer_youtube_url' => '',
            'footer_phone' => '', // Required
            'footer_email' => 'invalid-email', // Must be email
            'footer_address' => '',
            'footer_copyright' => '',
            'footer_account_links' => [],
            'footer_info_links' => [],
        ];

        $response = $this->actingAs($user)
            ->from(route('admin.settings.index'))
            ->post(route('admin.settings.update'), $payload);

        $response->assertSessionHasErrors([
            'site_name',
            'shipping_cost',
            'footer_description',
            'footer_facebook_url',
            'footer_phone',
            'footer_email',
        ]);
    }
}
