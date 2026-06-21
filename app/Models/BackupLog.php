<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BackupLog extends Model
{
    protected $fillable = [
        'type',
        'filename',
        'size_bytes',
        'storage_path',
        'status',
        'error',
    ];
}
