<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedCustomer extends Model
{
    protected $fillable = ['phone', 'reason', 'blocked_by'];

    public function blocker()
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }
}
