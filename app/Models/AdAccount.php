<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdAccount extends Model
{
    protected $fillable = [
        'facebook_account_id',
        'account_id',
        'name',
    ];

    public function facebookAccount()
    {
        return $this->belongsTo(FacebookAccount::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }
}
