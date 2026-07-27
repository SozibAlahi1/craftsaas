<?php

namespace App\Console\Commands;

use App\Models\FeaturedTile;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Console\Command;

class FixImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-image-urls';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Replace http:// with https:// in all stored image URLs';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Fixing image URLs from http:// to https://...');

        $domain = config('app.url');
        $httpDomain = str_replace('https://', 'http://', $domain);

        // Fix Product image & gallery
        $products = Product::all();
        $productCount = 0;

        foreach ($products as $product) {
            $changed = false;

            if ($product->image && str_contains($product->image, 'http://')) {
                $product->image = str_replace('http://', 'https://', $product->image);
                $changed = true;
            }

            if ($product->gallery) {
                $gallery = $product->gallery;
                $fixedGallery = array_map(function ($url) {
                    return str_contains($url, 'http://') ? str_replace('http://', 'https://', $url) : $url;
                }, $gallery);

                if ($gallery !== $fixedGallery) {
                    $product->gallery = $fixedGallery;
                    $changed = true;
                }
            }

            if ($changed) {
                $product->save();
                $productCount++;
            }
        }

        $this->info("  Fixed {$productCount} product(s).");

        // Fix FeaturedTile images (if stored with http://)
        $tileCount = 0;
        foreach (FeaturedTile::all() as $tile) {
            if ($tile->image && str_contains($tile->image, 'http://')) {
                $tile->image = str_replace('http://', 'https://', $tile->image);
                $tile->save();
                $tileCount++;
            }
        }

        $this->info("  Fixed {$tileCount} featured tile(s).");

        // Fix SiteSetting values that may contain http:// URLs
        $settingKeys = ['site_logo', 'site_favicon'];
        $settingCount = 0;
        foreach ($settingKeys as $key) {
            $value = SiteSetting::getValue($key);
            if ($value && str_contains($value, 'http://')) {
                SiteSetting::setValue($key, str_replace('http://', 'https://', $value));
                $settingCount++;
            }
        }

        $this->info("  Fixed {$settingCount} site setting(s).");

        $this->newLine();
        $this->info('Done! All image URLs have been updated to use https://.');

        return self::SUCCESS;
    }
}
