<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductArchiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_archive_displays_category_name_for_slug_filter()
    {
        $category = Category::create([
            'name' => 'Combo Package',
            'slug' => 'combo-package',
        ]);

        $product = Product::create([
            'name' => 'Sample Product',
            'slug' => 'sample-product',
            'category_id' => $category->id,
            'price' => '100',
            'image' => 'https://example.com/sample-product.jpg',
            'description' => 'A test product description.',
        ]);

        $response = $this->get('/products?category=combo-package');

        $response->assertOk();
        $response->assertSee('Combo Package');
        $response->assertSee('sample-product');
    }
}
