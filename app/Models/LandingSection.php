<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingSection extends Model
{
    protected $fillable = ['landing_page_id', 'type', 'sort_order', 'content', 'styles'];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'styles' => 'array',
        ];
    }

    public function page()
    {
        return $this->belongsTo(LandingPage::class, 'landing_page_id');
    }
}
