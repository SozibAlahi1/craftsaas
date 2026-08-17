<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_delete_single_order_and_restore_stock(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'description' => 'Test Description',
            'image' => 'products/test.jpg',
            'price' => 500,
            'stock_quantity' => 10,
            'is_in_stock' => true,
        ]);

        $order = Order::create([
            'order_number' => 'WT-999999',
            'full_name' => 'John Doe',
            'phone' => '01700000000',
            'address' => 'Dhaka Bangladesh',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 500,
            'shipping' => 60,
            'total' => 560,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'name' => $product->name,
            'price' => 500,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($user)->delete(route('admin.orders.destroy', $order->id), [
            'restore_stock' => true,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
        $this->assertDatabaseMissing('order_items', ['order_id' => $order->id]);

        $product->refresh();
        $this->assertEquals(12, $product->stock_quantity);
    }

    public function test_admin_can_bulk_delete_orders(): void
    {
        $user = User::factory()->create();

        $order1 = Order::create([
            'order_number' => 'WT-888881',
            'full_name' => 'User One',
            'phone' => '01700000001',
            'address' => 'Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 200,
            'shipping' => 60,
            'total' => 260,
        ]);

        $order2 = Order::create([
            'order_number' => 'WT-888882',
            'full_name' => 'User Two',
            'phone' => '01700000002',
            'address' => 'Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 300,
            'shipping' => 60,
            'total' => 360,
        ]);

        $response = $this->actingAs($user)->delete(route('admin.orders.bulk-destroy'), [
            'order_ids' => [$order1->id, $order2->id],
            'restore_stock' => false,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('orders', ['id' => $order1->id]);
        $this->assertDatabaseMissing('orders', ['id' => $order2->id]);
    }
}
