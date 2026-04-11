<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Palestrante extends Model
{
    protected $fillable = [
        'user_id',
        'cargo',
        'instituicao',
        'image_path',
    ];

    protected $with = [
        'user',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
