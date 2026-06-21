<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::query()
            ->withCount('orders')
            ->latest('last_order_at')
            ->paginate(15);

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
        ]);
    }

    public function show(Customer $customer)
    {
        $customer->load(['orders' => function ($query) {
            $query->latest()->with('items.product');
        }]);

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
        ]);
    }
}
