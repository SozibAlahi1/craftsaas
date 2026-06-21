<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['tags', 'assignedTo'])->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $leads = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/leads/index', [
            'leads' => $leads,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Lead $lead)
    {
        $lead->load(['tags', 'activities.user', 'assignedTo']);

        return Inertia::render('admin/leads/show', [
            'lead' => $lead,
            'users' => \App\Models\User::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,contacted,interested,converted,lost',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $oldStatus = $lead->status;
        $lead->update($validated);

        if ($oldStatus !== $lead->status) {
            $lead->activities()->create([
                'user_id' => auth()->id(),
                'action' => 'Status Changed',
                'note' => "Status changed from {$oldStatus} to {$lead->status}",
            ]);
        }

        return back()->with('success', 'Lead updated successfully.');
    }

    public function addActivity(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'note' => 'required|string',
            'action' => 'required|string',
        ]);

        $lead->activities()->create([
            'user_id' => auth()->id(),
            'action' => $validated['action'],
            'note' => $validated['note'],
        ]);

        return back()->with('success', 'Activity logged.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $path = $request->file('csv_file')->getRealPath();
        $data = array_map('str_getcsv', file($path));
        
        $header = array_shift($data);
        // Simple heuristic to find phone and name columns
        $phoneIdx = array_search('phone', array_map('strtolower', $header));
        $nameIdx = array_search('name', array_map('strtolower', $header));

        if ($phoneIdx === false) {
            return back()->withErrors(['csv_file' => 'CSV must contain a "phone" column.']);
        }

        $imported = 0;
        foreach ($data as $row) {
            if (!isset($row[$phoneIdx]) || empty(trim($row[$phoneIdx]))) continue;
            
            $phone = preg_replace('/[^\d\+]/', '', $row[$phoneIdx]);
            
            Lead::firstOrCreate(
                ['phone' => $phone],
                [
                    'name' => $nameIdx !== false ? ($row[$nameIdx] ?? null) : null,
                    'source' => 'csv_import',
                    'status' => 'new',
                ]
            );
            $imported++;
        }

        return back()->with('success', "{$imported} leads imported successfully.");
    }
}
