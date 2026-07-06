<?php

namespace Tests\Feature;

use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ProductSeeder::class);
    }

    public function test_product_page_can_be_rendered(): void
    {
        $this->get('/products/premium-leather-wallet')
            ->assertInertia(fn (Assert $page) => $page
                ->component('products/show')
                ->where('product.slug', 'premium-leather-wallet')
                ->where('product.name', 'Premium Leather Wallet')
                ->where('product.variations.colors.0', 'Brown')
                ->where('product.variations.sizes.0', 'Standard'));
    }

    public function test_unknown_product_returns_404(): void
    {
        $this->get('/products/unknown-product')->assertNotFound();
    }
}
