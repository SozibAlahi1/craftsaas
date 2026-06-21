<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class CheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test checkout validation with valid data.
     */
    public function test_checkout_validation_passes_with_valid_data(): void
    {
        // Mock cart session with correct structure
        Session::put('cart', [
            'test-product' => [
                'slug' => 'test-product',
                'name' => 'Test Product',
                'price' => '৳1,000',
                'image' => 'test.jpg',
                'quantity' => 1,
                'color' => 'Black',
            ],
        ]);

        $response = $this->post(route('checkout.store'), [
            'full_name' => 'John Doe',
            'phone' => '01712345678',
            'address' => '123 Test Street, Dhaka, Bangladesh',
            'payment_method' => 'cod',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('checkout.thank-you'));
        $response->assertSessionHas('last_order');

        $order = session('last_order');
        $this->assertEquals('John Doe', $order['customer']['full_name']);
        $this->assertEquals('cod', $order['payment_method']);
    }

    /**
     * Test checkout validation with invalid phone number.
     */
    public function test_checkout_validation_fails_with_invalid_phone(): void
    {
        // Mock cart session
        Session::put('cart', ['some' => 'item']);

        $response = $this->post(route('checkout.store'), [
            'full_name' => 'John Doe',
            'phone' => '12345', // Invalid phone
            'address' => '123 Test Street, Dhaka, Bangladesh',
            'payment_method' => 'cod',
        ]);

        $response->assertSessionHasErrors(['phone']);
    }

    /**
     * Test checkout validation with valid Bangladesh phone number formats.
     */
    public function test_checkout_validation_passes_with_different_phone_formats(): void
    {
        Session::put('cart', ['some' => 'item']);

        $validPhones = ['01712345678', '+8801712345678', '8801712345678'];

        foreach ($validPhones as $phone) {
            $response = $this->post(route('checkout.store'), [
                'full_name' => 'John Doe',
                'phone' => $phone,
                'address' => '123 Test Street, Dhaka, Bangladesh',
                'payment_method' => 'cod',
            ]);

            $response->assertSessionHasNoErrors();
        }
    }
}
