<?php

namespace Tests\Feature\Admin;

use App\Models\Pixel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PixelManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_pixel_with_long_access_token(): void
    {
        $user = User::factory()->create();

        // Facebook Graph API tokens are typically long (e.g. 200+ chars), which become ~500+ chars when encrypted
        $longAccessToken = 'EAAGm0P'.str_repeat('a1b2c3d4e5f6g7h8i9j0', 20);

        $response = $this->actingAs($user)->post(route('admin.pixels.store'), [
            'name' => 'Main Store Pixel',
            'pixel_id' => '1015588498013083',
            'access_token' => $longAccessToken,
            'is_active' => true,
            'test_event_code' => 'TEST31933',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $pixel = Pixel::first();
        $this->assertNotNull($pixel);
        $this->assertEquals('Main Store Pixel', $pixel->name);
        $this->assertEquals('1015588498013083', $pixel->pixel_id);
        $this->assertEquals($longAccessToken, $pixel->access_token);
    }
}
