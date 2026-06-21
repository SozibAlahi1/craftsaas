<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BackupLog;
use App\Jobs\BackupJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BackupController extends Controller
{
    public function index()
    {
        $backups = BackupLog::latest()->paginate(20);
        return Inertia::render('admin/backups/index', [
            'backups' => $backups
        ]);
    }

    public function store()
    {
        dispatch(new BackupJob());
        return redirect()->back()->with('success', 'Backup triggered and is running in the background.');
    }
    
    public function download(BackupLog $backup)
    {
        $path = storage_path('app/' . $backup->storage_path);
        
        if (file_exists($path)) {
            return response()->download($path);
        }
        
        return redirect()->back()->with('error', 'Backup file not found.');
    }
}
