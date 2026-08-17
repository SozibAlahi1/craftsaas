<?php

namespace Tests\Feature;

use App\Models\BlockedCustomer;
use App\Models\Order;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FakeOrderProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::setValue('shipping_cost_inside_dhaka', '60');
        SiteSetting::setValue('shipping_cost_outside_dhaka', '120');

        Product::create([
            'name' => 'Sample Item',
            'slug' => 'sample-item',
            'description' => 'Sample description',
            'image' => 'products/sample.jpg',
            'price' => 500,
            'stock_quantity' => 20,
            'is_in_stock' => true,
        ]);
    }

    public function test_duplicate_order_shield_blocks_rapid_duplicate_order(): void
    {
        // Place initial order
        Order::create([
            'order_number' => 'WT-100001',
            'full_name' => 'Customer A',
            'phone' => '01711223344',
            'address' => 'House 1, Road 2, Gulshan, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 500,
            'shipping' => 60,
            'total' => 560,
        ]);

        // Attempting to place a second order within 5 minutes with same phone
        $response = $this->withSession(['cart' => [
            'sample-item' => [
                'name' => 'Sample Item',
                'slug' => 'sample-item',
                'price' => '500',
                'quantity' => 1,
            ],
        ]])->post(route('checkout.store'), [
            'full_name' => 'Customer A',
            'phone' => '01711223344',
            'address' => 'House 1, Road 2, Gulshan, Dhaka',
            'payment_method' => 'cod',
            'shipping_area' => 'inside',
        ]);

        $response->assertSessionHasErrors(['phone']);
    }

    public function test_blocked_customer_cannot_place_order(): void
    {
        BlockedCustomer::create([
            'phone' => '01899887766',
            'reason' => 'Repeated fake orders',
        ]);

        $response = $this->withSession(['cart' => [
            'sample-item' => [
                'name' => 'Sample Item',
                'slug' => 'sample-item',
                'price' => '500',
                'quantity' => 1,
            ],
        ]])->post(route('checkout.store'), [
            'full_name' => 'Fake User',
            'phone' => '01899887766',
            'address' => 'House 10, Road 5, Mirpur, Dhaka',
            'payment_method' => 'cod',
            'shipping_area' => 'inside',
        ]);

        $response->assertSessionHasErrors(['phone']);
    }
}
