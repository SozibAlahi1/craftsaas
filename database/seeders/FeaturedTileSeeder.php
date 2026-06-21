<?php

namespace Database\Seeders;

use App\Models\FeaturedTile;
use Illuminate\Database\Seeder;

class FeaturedTileSeeder extends Seeder
{
    public function run(): void
    {
        $tiles = [
            ['title' => "Men's Shoes", 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/shoe.png', 'order' => 1],
            ['title' => 'Bag Collection', 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/bag.png', 'order' => 2],
            ['title' => 'Belt Collection', 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/belt.png', 'order' => 3],
            ['title' => "Wallet's", 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/wallet.png', 'order' => 4],
            ['title' => 'Women Bags', 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/women-bag.png', 'order' => 5],
            ['title' => 'Women Shoes', 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/women-shoes.png', 'order' => 6],
            ['title' => 'Backpack', 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/bagpack.png', 'order' => 7],
            ['title' => "Men's Sandal", 'image' => 'https://ssbleather.com/wp-content/uploads/2026/01/sandal.png', 'order' => 8],
        ];

        foreach ($tiles as $tile) {
            FeaturedTile::create($tile);
        }
    }
}
