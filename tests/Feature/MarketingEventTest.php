<?php

namespace Tests\Feature;

use App\Models\MarketingEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Pixel;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MarketingEventTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create an active pixel with access token so Meta CAPI runs
        Pixel::create([
            'name' => 'Test Pixel',
            'pixel_id' => '1234567890',
            'access_token' => 'EAAGm0P...',
            'is_active' => true,
        ]);
    }

    /**
     * Test admin can update marketing trigger settings.
     */
    public function test_admin_can_update_marketing_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('admin.settings.marketing.update'), [
                'marketing_purchase_trigger' => 'shipped',
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertEquals('shipped', SiteSetting::getValue('marketing_purchase_trigger'));
    }

    /**
     * Test order creation triggers purchase event if trigger is 'created'.
     */
    public function test_order_created_triggers_purchase_if_configured(): void
    {
        SiteSetting::setValue('marketing_purchase_trigger', 'created');

        Http::fake([
            'https://graph.facebook.com/*' => Http::response(['success' => true], 200),
        ]);

        $order = Order::create([
            'order_number' => 'WT-111111',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Leather Wallet',
            'price' => 1200,
            'quantity' => 1,
            'options' => ['color' => 'Brown'],
        ]);

        // Assert marketing event was triggered, logged, and marked sent
        $this->assertDatabaseHas('marketing_events', [
            'order_id' => $order->id,
            'event_name' => 'Purchase',
            'platform' => 'meta',
            'sent' => true,
        ]);
    }

    /**
     * Test order confirmation triggers purchase event if trigger is 'confirmed'.
     */
    public function test_order_confirmation_triggers_purchase_if_configured(): void
    {
        SiteSetting::setValue('marketing_purchase_trigger', 'confirmed');

        Http::fake([
            'https://graph.facebook.com/*' => Http::response(['success' => true], 200),
        ]);

        $order = Order::create([
            'order_number' => 'WT-222222',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Leather Wallet',
            'price' => 1200,
            'quantity' => 1,
            'options' => ['color' => 'Brown'],
        ]);

        // Verify no purchase event sent yet
        $this->assertDatabaseMissing('marketing_events', [
            'order_id' => $order->id,
            'event_name' => 'Purchase',
        ]);

        // Transition order status to processing (mapped to 'confirmed')
        $order->update(['status' => 'processing']);

        // Assert marketing event was triggered, sent, and response logged
        $this->assertDatabaseHas('marketing_events', [
            'order_id' => $order->id,
            'event_name' => 'Purchase',
            'platform' => 'meta',
            'sent' => true,
        ]);
    }

    /**
     * Test duplicate protection: purchase event is only sent once per order per platform.
     */
    public function test_purchase_event_has_duplicate_protection(): void
    {
        SiteSetting::setValue('marketing_purchase_trigger', 'confirmed');

        Http::fake([
            'https://graph.facebook.com/*' => Http::response(['success' => true], 200),
        ]);

        $order = Order::create([
            'order_number' => 'WT-333333',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'name' => 'Leather Wallet',
            'price' => 1200,
            'quantity' => 1,
            'options' => ['color' => 'Brown'],
        ]);

        // Trigger status change to processing
        $order->update(['status' => 'processing']);

        $this->assertDatabaseHas('marketing_events', [
            'order_id' => $order->id,
            'event_name' => 'Purchase',
            'platform' => 'meta',
            'sent' => true,
        ]);

        // Verify only 1 marketing event is logged in DB per platform (6 platforms in total)
        $this->assertEquals(1, MarketingEvent::where('order_id', $order->id)->where('platform', 'meta')->where('event_name', 'Purchase')->count());
        $this->assertEquals(6, MarketingEvent::where('order_id', $order->id)->where('event_name', 'Purchase')->count());

        // Update status again: it should NOT log another or resend
        $order->update(['status' => 'confirmed']);

        $this->assertEquals(1, MarketingEvent::where('order_id', $order->id)->where('platform', 'meta')->where('event_name', 'Purchase')->count());
        $this->assertEquals(6, MarketingEvent::where('order_id', $order->id)->where('event_name', 'Purchase')->count());
    }

    /**
     * Test admin can view marketing event logs index page.
     */
    public function test_admin_can_access_marketing_events_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.marketing-events.index'));

        $response->assertStatus(200);
    }

    /**
     * Test admin can manually resend an event.
     */
    public function test_admin_can_manually_resend_event(): void
    {
        $user = User::factory()->create();

        $order = Order::create([
            'order_number' => 'WT-444444',
            'full_name' => 'Jane Doe',
            'phone' => '01712345678',
            'address' => 'House 2, Road 3, Dhaka',
            'payment_method' => 'cod',
            'status' => 'pending',
            'subtotal' => 1200,
            'shipping' => 60,
            'total' => 1260,
        ]);

        $event = MarketingEvent::create([
            'order_id' => $order->id,
            'platform' => 'meta',
            'event_name' => 'Purchase',
            'trigger_status' => 'processing',
            'payload' => [],
            'response' => ['success' => true],
            'sent' => true,
        ]);

        Http::fake([
            'https://graph.facebook.com/*' => Http::response(['success' => true, 'forced' => true], 200),
        ]);

        $response = $this->actingAs($user)
            ->post(route('admin.marketing-events.resend', $event->id));

        $response->assertRedirect();

        $event->refresh();
        $this->assertTrue($event->sent);
        $this->assertArrayHasKey('forced', $event->response['1234567890']['body']);
    }
}
