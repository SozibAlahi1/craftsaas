<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Disable Inertia's test-time page existence check so JS/TSX pages
        // resolved by Vite don't block PHPUnit assertions in this environment.
        config(['inertia.testing.ensure_pages_exist' => false]);
    }
}
