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
        SiteSetting::setValue('site_name', 'শুটকি ভ্যালী');
        SiteSetting::setValue('shipping_cost', '60');
        SiteSetting::setValue('footer_description', 'বাংলাদেশের সেরা শুকটি মাছের অনলাইন বাজার। তাজা ও মানসম্পন্ন শুকটি মাছ সরাসরি আপনার দরজায়।');
        SiteSetting::setValue('footer_facebook_url', 'https://facebook.com');
        SiteSetting::setValue('footer_youtube_url', 'https://youtube.com');
        SiteSetting::setValue('footer_phone', '01700000000');
        SiteSetting::setValue('footer_email', 'info@shutkivalley.com');
        SiteSetting::setValue('footer_address', 'শুটকি ভ্যালী, কক্সবাজার, বাংলাদেশ');
        SiteSetting::setValue('footer_copyright', '© 2026 শুটকি ভ্যালী। সর্বস্বত্ব সংরক্ষিত।');

        SiteSetting::setValue('footer_account_links', [
            ['label' => 'আমার অ্যাকাউন্ট', 'url' => '/profile'],
            ['label' => 'অর্ডার ট্র্যাক করুন', 'url' => 'track-order'],
            ['label' => 'রিফান্ড ও রিটার্ন পলিসি', 'url' => '#'],
            ['label' => 'অ্যাফিলিয়েট হিসেবে যোগ দিন', 'url' => '#'],
            ['label' => 'অভিযোগ বক্স', 'url' => '#'],
        ]);

        SiteSetting::setValue('footer_info_links', [
            ['label' => 'সব শুটকি কালেকশন', 'url' => '/products'],
            ['label' => 'আমাদের শোরুম', 'url' => '#'],
            ['label' => 'আমাদের সম্পর্কে', 'url' => '#'],
            ['label' => 'প্রাইভেসি পলিসি', 'url' => '#'],
            ['label' => 'টার্মস ও কন্ডিশনস', 'url' => '#'],
        ]);
    }
}
