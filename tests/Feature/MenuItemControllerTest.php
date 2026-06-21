<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuItemControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test guests are redirected from menu items dashboard.
     */
    public function test_guest_cannot_access_menu_items_index(): void
    {
        $response = $this->get(route('admin.menu-items.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test authenticated admin can access menu items dashboard.
     */
    public function test_admin_can_access_menu_items_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.menu-items.index'));

        $response->assertOk();
    }

    /**
     * Test admin can create a custom URL menu item.
     */
    public function test_admin_can_create_custom_menu_item(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.menu-items.store'), [
            'title' => 'Contact Us',
            'type' => 'custom',
            'url' => '/contact',
            'order' => 10,
        ]);

        $response->assertRedirect(route('admin.menu-items.index'));
        $this->assertDatabaseHas('menu_items', [
            'title' => 'Contact Us',
            'type' => 'custom',
            'url' => '/contact',
            'order' => 10,
        ]);
    }

    /**
     * Test admin can create a product category menu item.
     */
    public function test_admin_can_create_category_menu_item(): void
    {
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Premium Wallets',
            'slug' => 'premium-wallets',
        ]);

        $response = $this->actingAs($user)->post(route('admin.menu-items.store'), [
            'title' => 'Wallets Link',
            'type' => 'category',
            'category_id' => $category->id,
            'order' => 5,
        ]);

        $response->assertRedirect(route('admin.menu-items.index'));
        $this->assertDatabaseHas('menu_items', [
            'title' => 'Wallets Link',
            'type' => 'category',
            'category_id' => $category->id,
            'order' => 5,
        ]);
    }

    /**
     * Test admin can update an existing menu item.
     */
    public function test_admin_can_update_menu_item(): void
    {
        $user = User::factory()->create();
        $menuItem = MenuItem::create([
            'title' => 'Old Title',
            'type' => 'custom',
            'url' => '/old-url',
            'order' => 1,
        ]);

        $response = $this->actingAs($user)->put(route('admin.menu-items.update', $menuItem->id), [
            'title' => 'New Title',
            'type' => 'custom',
            'url' => '/new-url',
            'order' => 2,
        ]);

        $response->assertRedirect(route('admin.menu-items.index'));
        $this->assertDatabaseHas('menu_items', [
            'id' => $menuItem->id,
            'title' => 'New Title',
            'type' => 'custom',
            'url' => '/new-url',
            'order' => 2,
        ]);
    }

    /**
     * Test admin can delete a menu item.
     */
    public function test_admin_can_delete_menu_item(): void
    {
        $user = User::factory()->create();
        $menuItem = MenuItem::create([
            'title' => 'Delete Me',
            'type' => 'custom',
            'url' => '/delete',
        ]);

        $response = $this->actingAs($user)->delete(route('admin.menu-items.destroy', $menuItem->id));

        $response->assertRedirect(route('admin.menu-items.index'));
        $this->assertDatabaseMissing('menu_items', [
            'id' => $menuItem->id,
        ]);
    }
}
