<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Safe delete existing items to prevent duplicate seeding
        MenuItem::query()->delete();

        // Get existing categories to link menu items properly
        $walletsCat = Category::where('slug', 'wallets')->first();
        $beltsCat = Category::where('slug', 'belts')->first();
        $bagsCat = Category::where('slug', 'bags')->first();

        $catalogSections = [
            [
                'title' => "Men's Collection",
                'items' => ['Wallets', 'Belts', 'Card Holders', 'Office Bags', 'Messenger Bags', 'Backpacks', 'Key Rings', 'Watch Straps'],
            ],
            [
                'title' => "Women's Collection",
                'items' => ['Handbags', 'Tote Bags', 'Crossbody Bags', 'Clutches', 'Wallets', 'Vanity Bags'],
            ],
            [
                'title' => 'Office & Professional',
                'items' => ['Laptop Sleeves', 'Briefcases', 'Document Holders', 'Desk Accessories'],
            ],
            [
                'title' => 'Travel Collection',
                'items' => ['Duffel Bags', 'Passport Holders', 'Travel Organizers', 'Luggage Tags'],
            ],
            [
                'title' => 'Accessories',
                'items' => ['Keychains', 'Pen Holders', 'Mouse Pads', 'Phone Covers', 'AirPods Cases'],
            ],
            [
                'title' => 'Handmade Collection',
                'items' => ['Handcrafted Products', 'Limited Edition', 'Artisan Series', 'Gifts For Him', 'Gifts For Her', 'Corporate Gifts', 'Personalized Gifts'],
            ],
            [
                'title' => 'Premium / Luxury Series',
                'items' => ['Full Grain Leather', 'Crazy Horse Leather', 'Vintage Collection', 'Executive Series'],
            ],
        ];

        $order = 1;
        foreach ($catalogSections as $section) {
            $parent = MenuItem::create([
                'title' => $section['title'],
                'type' => 'custom',
                'url' => '#',
                'order' => $order++,
            ]);

            $subOrder = 1;
            foreach ($section['items'] as $item) {
                $type = 'custom';
                $categoryId = null;
                $url = '/products';

                // Determine category
                if (str_contains(strtolower($item), 'wallet') || str_contains(strtolower($item), 'card holder')) {
                    if ($walletsCat) {
                        $type = 'category';
                        $categoryId = $walletsCat->id;
                    } else {
                        $url = '/products?category=Wallets';
                    }
                } elseif (str_contains(strtolower($item), 'belt')) {
                    if ($beltsCat) {
                        $type = 'category';
                        $categoryId = $beltsCat->id;
                    } else {
                        $url = '/products?category=Belts';
                    }
                } else {
                    // Default bags
                    if ($bagsCat) {
                        $type = 'category';
                        $categoryId = $bagsCat->id;
                    } else {
                        $url = '/products?category=Bags';
                    }
                }

                MenuItem::create([
                    'title' => $item,
                    'type' => $type,
                    'category_id' => $categoryId,
                    'url' => $type === 'custom' ? $url : null,
                    'parent_id' => $parent->id,
                    'order' => $subOrder++,
                ]);
            }
        }
    }
}
