<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadTag extends Model
{
    protected $fillable = ['lead_id', 'tag'];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
