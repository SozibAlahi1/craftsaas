<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdCopy extends Model
{
    protected $fillable = ['product_id', 'tone', 'language', 'content'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
