<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'source',
        'status',
        'assigned_to',
        'notes',
    ];

    public function tags()
    {
        return $this->hasMany(LeadTag::class);
    }

    public function activities()
    {
        return $this->hasMany(LeadActivity::class)->latest();
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    public function scopeByTag($query, $tag)
    {
        return $query->whereHas('tags', function ($q) use ($tag) {
            $q->where('tag', $tag);
        });
    }
}
