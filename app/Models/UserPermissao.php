<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPermissao extends Model
{
    protected $fillable = [
        'user_id',
        'permissao_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function permissao(): BelongsTo
    {
        return $this->belongsTo(Permissao::class);
    }
}
