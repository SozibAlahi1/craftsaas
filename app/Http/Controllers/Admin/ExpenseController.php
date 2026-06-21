<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::with('creator')
            ->orderBy('date', 'desc')
            ->paginate(15);

        // Simple summary
        $summary = [
            'total_this_month' => Expense::whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('amount'),
            'categories' => Expense::selectRaw('category, SUM(amount) as total')
                ->whereMonth('date', now()->month)
                ->groupBy('category')
                ->get(),
        ];

        return Inertia::render('admin/expenses/index', [
            'expenses' => $expenses,
            'summary' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:fixed,variable',
            'date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()->id;

        Expense::create($validated);

        return redirect()->back()->with('success', 'Expense recorded successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->back()->with('success', 'Expense deleted.');
    }
}
