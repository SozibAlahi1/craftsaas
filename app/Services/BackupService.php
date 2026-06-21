<?php

namespace App\Services;

use App\Models\BackupLog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class BackupService
{
    public function runBackup(string $type = 'auto'): BackupLog
    {
        $filename = 'backup_' . now()->format('Y_m_d_His') . '.sql.gz';
        $path = storage_path('app/backups/' . $filename);
        
        if (!file_exists(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        $log = BackupLog::create([
            'type' => $type,
            'filename' => $filename,
            'storage_path' => 'backups/' . $filename,
            'status' => 'running',
        ]);

        try {
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbHost = config('database.connections.mysql.host');
            
            // Note: In production, pass the password via environment variable to avoid it showing in ps aux
            $command = sprintf(
                'mysqldump -h %s -u %s %s %s | gzip > %s',
                escapeshellarg($dbHost),
                escapeshellarg($dbUser),
                $dbPass ? '-p' . escapeshellarg($dbPass) : '',
                escapeshellarg($dbName),
                escapeshellarg($path)
            );

            $process = Process::fromShellCommandline($command);
            $process->setTimeout(300);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('mysqldump failed: ' . $process->getErrorOutput());
            }

            // In a real app with Google Drive, you'd use the google drive storage disk here
            // e.g. Storage::disk('google')->put($filename, file_get_contents($path));
            
            $size = filesize($path);

            $log->update([
                'status' => 'success',
                'size_bytes' => $size,
            ]);

            return $log;
        } catch (\Exception $e) {
            Log::error('Backup Error: ' . $e->getMessage());
            $log->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);
            
            return $log;
        }
    }
}
