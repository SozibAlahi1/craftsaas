<?php

namespace Tests\Unit;

use App\Services\SlugService;
use Tests\TestCase;

class SlugServiceTest extends TestCase
{
    /**
     * Test ASCII slugs are generated correctly.
     */
    public function test_ascii_slugs(): void
    {
        $this->assertEquals('shoes-and-bags', SlugService::make('Shoes and Bags'));
        $this->assertEquals('electronics', SlugService::make('Electronics'));
    }

    /**
     * Test Bengali translation and slugging.
     */
    public function test_bengali_slugs(): void
    {
        // "ফ্যাশন" translates to "Fashion" (which slugs to "fashion")
        $this->assertEquals('fashion', SlugService::make('ফ্যাশন'));

        // "জুতা ও ব্যাগ" translates to "Shoes and bags" (which slugs to "shoes-and-bags")
        $this->assertEquals('shoes-and-bags', SlugService::make('জুতা ও ব্যাগ'));
    }
}
