<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'slug' => 'premium-leather-wallet',
                'name' => 'Premium Leather Wallet',
                'category' => 'Wallets',
                'price' => '৳ 1,850',
                'old_price' => '৳ 2,450',
                'discount_text' => '৳ 600 OFF',
                'image' => 'https://cdn.believers.com.bd/product_image/2026/january/634/product_hover-634-20260120050104.jpg?v=1768885264',
                'gallery' => [
                    'https://cdn.believers.com.bd/product_image/2026/january/634/product_hover-634-20260120050104.jpg?v=1768885264',
                    'https://cdn.believers.com.bd/product_image/2026/january/634/product_hover-634-20260120050104.jpg?v=1768885264',
                    'https://cdn.believers.com.bd/product_image/2026/january/634/product_hover-634-20260120050104.jpg?v=1768885264',
                ],
                'description' => 'A compact premium leather wallet designed for everyday carry with multiple card slots and a clean finish.',
                'highlights' => ['Genuine leather build', 'Slim profile', 'Multiple card slots', 'Gift-ready packaging'],
                'variations' => [
                    'colors' => ['Brown', 'Black', 'Tan'],
                    'sizes' => ['Standard'],
                ],
                'color' => 'Brown',
            ],
            [
                'slug' => 'classic-leather-belt',
                'name' => 'Classic Leather Belt',
                'category' => 'Belts',
                'price' => '৳ 1,450',
                'old_price' => '৳ 1,950',
                'discount_text' => '৳ 500 OFF',
                'image' => 'https://cdn.believers.com.bd/product_image/2026/january/653/product_hover-653-20260120060542.jpg?v=1768889142',
                'gallery' => [
                    'https://cdn.believers.com.bd/product_image/2026/january/653/product_hover-653-20260120060542.jpg?v=1768889142',
                    'https://cdn.believers.com.bd/product_image/2026/january/653/product_hover-653-20260120060542.jpg?v=1768889142',
                    'https://cdn.believers.com.bd/product_image/2026/january/653/product_hover-653-20260120060542.jpg?v=1768889142',
                ],
                'description' => 'A classic belt that works with both formal and casual outfits, finished for daily comfort and durability.',
                'highlights' => ['Adjustable fit', 'Durable buckle', 'Everyday wear', 'Clean finish'],
                'variations' => [
                    'colors' => ['Black', 'Brown'],
                    'sizes' => ['S', 'M', 'L'],
                ],
                'color' => 'Black',
            ],
            [
                'slug' => 'travel-sling-bag',
                'name' => 'Travel Sling Bag',
                'category' => 'Bags',
                'price' => '৳ 2,700',
                'old_price' => '৳ 3,200',
                'discount_text' => '৳ 500 OFF',
                'image' => 'https://cdn.believers.com.bd/product_image/2026/january/639/product_hover-639-20260120051841.jpg?v=1768886321',
                'gallery' => [
                    'https://cdn.believers.com.bd/product_image/2026/january/639/product_hover-639-20260120051841.jpg?v=1768886321',
                    'https://cdn.believers.com.bd/product_image/2026/january/639/product_hover-639-20260120051841.jpg?v=1768886321',
                    'https://cdn.believers.com.bd/product_image/2026/january/639/product_hover-639-20260120051841.jpg?v=1768886321',
                ],
                'description' => 'A lightweight sling bag with room for travel essentials, built for comfort and quick access.',
                'highlights' => ['Lightweight build', 'Travel-friendly size', 'Quick-access pocket', 'Easy to carry'],
                'variations' => [
                    'colors' => ['Coffee', 'Black', 'Olive'],
                    'sizes' => ['Small', 'Medium'],
                ],
                'color' => 'Coffee',
            ],
            [
                'slug' => 'leather-messenger-bag',
                'name' => 'Leather Messenger Bag',
                'category' => 'Bags',
                'price' => '৳ 4,050',
                'old_price' => '৳ 4,850',
                'discount_text' => '৳ 800 OFF',
                'image' => 'https://cdn.believers.com.bd/product_image/2026/january/641/product_hover-641-20260120052513.jpg?v=1768886713',
                'gallery' => [
                    'https://cdn.believers.com.bd/product_image/2026/january/641/product_hover-641-20260120052513.jpg?v=1768886713',
                    'https://cdn.believers.com.bd/product_image/2026/january/641/product_hover-641-20260120052513.jpg?v=1768886713',
                    'https://cdn.believers.com.bd/product_image/2026/january/641/product_hover-641-20260120052513.jpg?v=1768886713',
                ],
                'description' => 'A structured messenger bag with a premium leather look and enough space for office essentials.',
                'highlights' => ['Office-friendly design', 'Structured shape', 'Comfort strap', 'Spacious main compartment'],
                'variations' => [
                    'colors' => ['Dark Brown', 'Black'],
                    'sizes' => ['Standard'],
                ],
                'color' => 'Dark Brown',
            ],
            [
                'slug' => 'smart-casual-backpack',
                'name' => 'Smart Casual Backpack',
                'category' => 'Bags',
                'price' => '৳ 4,900',
                'old_price' => '৳ 5,500',
                'discount_text' => '৳ 600 OFF',
                'image' => 'https://cdn.believers.com.bd/product_image/2026/january/646/product_hover-646-20260120054322.jpg?v=1768887802',
                'gallery' => [
                    'https://cdn.believers.com.bd/product_image/2026/january/646/product_hover-646-20260120054322.jpg?v=1768887802',
                    'https://cdn.believers.com.bd/product_image/2026/january/646/product_hover-646-20260120054322.jpg?v=1768887802',
                    'https://cdn.believers.com.bd/product_image/2026/january/646/product_hover-646-20260120054322.jpg?v=1768887802',
                ],
                'description' => 'A versatile backpack made for daily use, combining clean styling with practical storage.',
                'highlights' => ['Daily carry', 'Padded back panel', 'Organized storage', 'Smart casual style'],
                'variations' => [
                    'colors' => ['Black', 'Navy', 'Olive'],
                    'sizes' => ['20L', '25L'],
                ],
                'color' => 'Black',
            ],
            [
                'slug' => 'galaxy-s26-ultra-5g',
                'name' => 'Galaxy S26 Ultra 5G',
                'category' => 'Gadgets',
                'price' => '৳ 128,500',
                'old_price' => '৳ 136,000',
                'discount_text' => '৳ 7,500 OFF',
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1510557880182-3a3c6d7a0f2c?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
                ],
                'description' => 'A premium flagship device with a refined finish, built for performance and all-day use.',
                'highlights' => ['Flagship chipset', 'Bright display', 'Long battery life', 'Premium build'],
                'variations' => [
                    'colors' => ['Graphite', 'Silver', 'White', 'Lavender'],
                    'sizes' => ['256GB', '512GB'],
                ],
                'color' => 'Graphite',
            ],
            [
                'slug' => 'nothing-phone-4a-pro',
                'name' => 'Nothing Phone (4a) Pro',
                'category' => 'Gadgets',
                'price' => '৳ 58,500',
                'old_price' => null,
                'discount_text' => null,
                'image' => 'https://images.unsplash.com/photo-1510557880182-3a3c6d7a0f2c?auto=format&fit=crop&w=900&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1510557880182-3a3c6d7a0f2c?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1518444028785-8f8f1c7f1c6a?auto=format&fit=crop&w=900&q=80',
                ],
                'description' => 'A clean, lightweight phone with a modern finish and a smooth everyday experience.',
                'highlights' => ['Minimal design', 'Fast charging', 'Sharp camera', 'Smooth software'],
                'variations' => [
                    'colors' => ['White', 'Black'],
                    'sizes' => ['128GB', '256GB'],
                ],
                'color' => 'White',
            ],
            [
                'slug' => 'galaxy-a57-5g',
                'name' => 'Galaxy A57 5G',
                'category' => 'Gadgets',
                'price' => '৳ 48,500',
                'old_price' => null,
                'discount_text' => null,
                'image' => 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9b?auto=format&fit=crop&w=900&q=80',
                ],
                'description' => 'A balanced mid-range phone built for reliable performance and everyday value.',
                'highlights' => ['5G ready', 'Reliable battery', 'Everyday performance', 'Modern design'],
                'variations' => [
                    'colors' => ['Blue', 'White'],
                    'sizes' => ['128GB', '256GB'],
                ],
                'color' => 'Blue',
            ],
            [
                'slug' => 'xiaomi-pad-7',
                'name' => 'Xiaomi Pad 7',
                'category' => 'Gadgets',
                'price' => '৳ 38,500',
                'old_price' => '৳ 42,000',
                'discount_text' => '৳ 3,500 OFF',
                'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9b?auto=format&fit=crop&w=900&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9b?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
                ],
                'description' => 'A slim tablet for entertainment, browsing, and light productivity with a large immersive screen.',
                'highlights' => ['Large display', 'Slim body', 'Media friendly', 'Portable build'],
                'variations' => [
                    'colors' => ['Silver', 'Space Grey'],
                    'sizes' => ['64GB', '128GB'],
                ],
                'color' => 'Silver',
            ],
            [
                'slug' => 'samsung-galaxy-s24',
                'name' => 'Samsung Galaxy S24',
                'category' => 'Gadgets',
                'price' => '৳ 96,500',
                'old_price' => '৳ 102,000',
                'discount_text' => '৳ 5,500 OFF',
                'image' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1518444028785-8f8f1c7f1c6a?auto=format&fit=crop&w=900&q=80',
                ],
                'description' => 'A compact premium phone with a polished finish and a versatile camera setup.',
                'highlights' => ['Premium finish', 'Compact size', 'Versatile cameras', 'Fast performance'],
                'variations' => [
                    'colors' => ['Lavender', 'Graphite', 'Cream'],
                    'sizes' => ['128GB', '256GB'],
                ],
                'color' => 'Lavender',
            ],
        ];

        foreach ($products as $productData) {
            $categoryName = $productData['category'];

            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName, 'show_on_home' => true]
            );

            unset($productData['category']);
            $productData['category_id'] = $category->id;

            Product::create($productData);
        }
    }
}
