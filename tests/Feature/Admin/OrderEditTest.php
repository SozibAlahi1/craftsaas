<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class OrderEditTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_order_edit_page(): void
    {
        $user = User::factory()->create();

        $order = Order::create([
            'order_number' => 'WT-100001',
            'full_name' => 'John Doe',
            'phone' => '01700000000',
            'address' => 'Dhaka, Bangladesh',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1000,
            'shipping' => 60,
            'total' => 1060,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'T-Shirt',
            'price' => 500,
            'quantity' => 2,
        ]);

        $this->actingAs($user)
            ->get(route('admin.orders.edit', $order))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/orders/edit')
                ->where('order.id', $order->id)
                ->where('order.full_name', 'John Doe')
                ->where('order.items.0.name', 'T-Shirt')
            );
    }

    public function test_authenticated_user_can_update_order_details_and_recalculate_totals(): void
    {
        $user = User::factory()->create();

        $order = Order::create([
            'order_number' => 'WT-100002',
            'full_name' => 'Alice Smith',
            'phone' => '01800000000',
            'address' => 'Chittagong, Bangladesh',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 500,
            'shipping' => 60,
            'total' => 560,
        ]);

        $item1 = OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Jeans',
            'price' => 500,
            'quantity' => 1,
        ]);

        $updateData = [
            'full_name' => 'Alice Johnson',
            'phone' => '01900000000',
            'address' => 'Sylhet, Bangladesh',
            'payment_method' => 'bkash',
            'status' => 'processing',
            'shipping' => 100,
            'items' => [
                [
                    'id' => $item1->id,
                    'name' => 'Jeans Premium',
                    'price' => 600,
                    'quantity' => 2,
                ],
                [
                    'name' => 'Socks',
                    'price' => 150,
                    'quantity' => 3,
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->put(route('admin.orders.update', $order), $updateData);

        $response->assertRedirect(route('admin.orders.show', $order->id));

        $order->refresh();

        // Subtotal = (600 * 2) + (150 * 3) = 1200 + 450 = 1650
        // Shipping = 100
        // Total = 1750
        $this->assertEquals('Alice Johnson', $order->full_name);
        $this->assertEquals('01900000000', $order->phone);
        $this->assertEquals('Sylhet, Bangladesh', $order->address);
        $this->assertEquals('bkash', $order->payment_method);
        $this->assertEquals('processing', $order->status);
        $this->assertEquals(1650, $order->subtotal);
        $this->assertEquals(100, $order->shipping);
        $this->assertEquals(1750, $order->total);

        $this->assertCount(2, $order->items);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'name' => 'Jeans Premium',
            'price' => 600,
            'quantity' => 2,
        ]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'name' => 'Socks',
            'price' => 150,
            'quantity' => 3,
        ]);

        // Verify status log and activity log creation
        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'status' => 'processing',
            'changed_by' => $user->id,
        ]);

        $this->assertDatabaseHas('order_activities', [
            'order_id' => $order->id,
            'user_id' => $user->id,
            'action' => 'Order Updated',
        ]);
    }
}
