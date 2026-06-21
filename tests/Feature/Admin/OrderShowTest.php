<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class OrderShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_order_details(): void
    {
        $user = User::factory()->create();

        $order = Order::create([
            'order_number' => 'WT-987654',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
            'fraud_success_ratio' => 90,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Leather Wallet',
            'price' => 1200,
            'quantity' => 1,
            'options' => [
                'color' => 'Brown',
                'image' => '/storage/products/wallet.jpg',
            ],
        ]);

        $this->actingAs($user)
            ->get(route('admin.orders.show', $order))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/orders/show')
                ->where('order.id', $order->id)
                ->where('order.order_number', 'WT-987654')
                ->where('order.items.0.name', 'Leather Wallet')
                ->where('order.items.0.options.color', 'Brown')
                ->where('order.items.0.options.image', '/storage/products/wallet.jpg')
            );
    }
}
