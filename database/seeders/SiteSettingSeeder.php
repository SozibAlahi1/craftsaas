<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SiteSetting::setValue('site_name', 'Believers');
        SiteSetting::setValue('shipping_cost', '60');
        SiteSetting::setValue('footer_description', 'One of the largest Islamic Lifestyle brands in Bangladesh');
        SiteSetting::setValue('footer_facebook_url', 'https://facebook.com');
        SiteSetting::setValue('footer_youtube_url', 'https://youtube.com');
        SiteSetting::setValue('footer_phone', '09638090000');
        SiteSetting::setValue('footer_email', 'cc.believerssign@gmail.com');
        SiteSetting::setValue('footer_address', 'Shop-3/1, Eastern Plaza, Hatirpool, Dhaka, Dhaka, Bangladesh');
        SiteSetting::setValue('footer_copyright', '© 2026 Believers. All Rights Reserved');

        SiteSetting::setValue('footer_account_links', [
            ['label' => 'My Account', 'url' => '/profile'],
            ['label' => 'Track My Order', 'url' => '#'],
            ['label' => 'Join As Affiliate', 'url' => '#'],
            ['label' => 'Complain Box', 'url' => '#'],
        ]);

        SiteSetting::setValue('footer_info_links', [
            ['label' => 'Shop All', 'url' => '/products'],
            ['label' => 'Our Showrooms', 'url' => '#'],
            ['label' => 'Refund & Returned', 'url' => '#'],
            ['label' => 'About Us', 'url' => '#'],
            ['label' => 'Privacy Policy', 'url' => '#'],
            ['label' => 'Terms & Conditions', 'url' => '#'],
        ]);
    }
}
