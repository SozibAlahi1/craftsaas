<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CourierTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->adminUser = User::factory()->create();
    }

    /**
     * Test configuration index page loads successfully.
     */
    public function test_courier_configuration_page_can_be_rendered(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('courier.index'));

        $response->assertStatus(200);
    }

    /**
     * Test configuration settings can be saved in SiteSettings.
     */
    public function test_courier_credentials_can_be_saved(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->post(route('courier.update'), [
                'courier_api_key' => 'test-api-key',
                'courier_secret_key' => 'test-secret-key',
            ]);

        $response->assertRedirect();
        $this->assertEquals('test-api-key', SiteSetting::getValue('courier_api_key'));
        $this->assertEquals('test-secret-key', SiteSetting::getValue('courier_secret_key'));
    }

    /**
     * Test checking a customer's courier success ratio using the BD Courier API.
     */
    public function test_customer_courier_success_ratio_can_be_checked_with_bd_courier(): void
    {
        SiteSetting::setValue('bd_courier_api_key', 'test-bd-api-key');

        $order = Order::create([
            'order_number' => 'WT-654321',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
        ]);

        Http::fake([
            'https://api.bdcourier.com/courier-check' => Http::response([
                'status' => 'success',
                'data' => [
                    'summary' => [
                        'total_parcel' => 620,
                        'success_parcel' => 530,
                        'cancelled_parcel' => 90,
                        'success_ratio' => 85.48,
                    ],
                ],
                'reports' => [],
            ], 200),
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.orders.fraud-check', $order->id));

        $response->assertOk()
            ->assertJson(['success_ratio' => 85.48]);

        $order->refresh();
        $this->assertSame(85.48, (float) $order->fraud_success_ratio);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.bdcourier.com/courier-check'
                && $request['phone'] === '01712345678'
                && $request->hasHeader('Authorization', 'Bearer test-bd-api-key');
        });
    }

    /**
     * Test sending an order to Steadfast Courier.
     */
    public function test_order_can_be_dispatched_to_steadfast(): void
    {
        // Setup API keys
        SiteSetting::setValue('courier_api_key', 'mock-api-key');
        SiteSetting::setValue('courier_secret_key', 'mock-secret-key');

        // Create mock order
        $order = Order::create([
            'order_number' => 'WT-123456',
            'full_name' => 'Alice Doe',
            'phone' => '01712345678',
            'address' => 'House 1, Road 2, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1000,
            'shipping' => 60,
            'total' => 1060,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Leather Wallet',
            'price' => 1000,
            'quantity' => 1,
            'options' => [],
        ]);

        // Fake Steadfast API
        Http::fake([
            'https://portal.packzy.com/api/v1/create_order' => Http::response([
                'status' => 200,
                'message' => 'Consignment has been created successfully.',
                'consignment' => [
                    'consignment_id' => 999888,
                    'invoice' => 'WT-123456',
                    'tracking_code' => 'TESTTRACK123',
                    'status' => 'in_review',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post(route('orders.send-courier', $order->id));

        $response->assertRedirect();

        $order->refresh();
        $this->assertEquals('999888', $order->courier_consignment_id);
        $this->assertEquals('TESTTRACK123', $order->courier_tracking_code);
        $this->assertEquals('in_review', $order->courier_status);
        $this->assertEquals('processing', $order->status);
    }

    /**
     * Test synchronizing order courier status.
     */
    public function test_order_courier_status_can_be_synchronized(): void
    {
        SiteSetting::setValue('courier_api_key', 'mock-api-key');
        SiteSetting::setValue('courier_secret_key', 'mock-secret-key');

        $order = Order::create([
            'order_number' => 'WT-123456',
            'full_name' => 'Alice Doe',
            'phone' => '01712345678',
            'address' => 'House 1, Road 2, Dhaka',
            'payment_method' => 'cod',
            'status' => 'processing',
            'subtotal' => 1000,
            'shipping' => 60,
            'total' => 1060,
            'courier_consignment_id' => '999888',
            'courier_tracking_code' => 'TESTTRACK123',
            'courier_status' => 'in_review',
        ]);

        // Fake Steadfast Status API
        Http::fake([
            'https://portal.packzy.com/api/v1/status_by_trackingcode/TESTTRACK123' => Http::response([
                'status' => 200,
                'delivery_status' => 'delivered',
            ], 200),
        ]);

        $response = $this->actingAs($this->adminUser)
            ->post(route('orders.sync-courier', $order->id));

        $response->assertRedirect();

        $order->refresh();
        $this->assertEquals('delivered', $order->courier_status);
        $this->assertEquals('delivered', $order->status);
    }
}
