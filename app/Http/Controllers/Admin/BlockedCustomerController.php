<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedCustomer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockedCustomerController extends Controller
{
    /**
     * Display a listing of blocked customers.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $customers = BlockedCustomer::with('blocker')
            ->when($search, function ($q) use ($search) {
                $q->where('phone', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/blocked-customers/index', [
            'customers' => $customers,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly blocked customer.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'unique:blocked_customers,phone'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        BlockedCustomer::create([
            'phone' => $validated['phone'],
            'reason' => $validated['reason'],
            'blocked_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Customer blocked successfully.');
    }

    /**
     * Unblock a customer.
     */
    public function destroy(BlockedCustomer $blockedCustomer)
    {
        $blockedCustomer->delete();

        return redirect()->back()->with('success', 'Customer unblocked successfully.');
    }
}
