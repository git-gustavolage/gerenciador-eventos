<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ministrante extends Model
{
    protected $fillable = [
        'id_atividade',
        'nome',
        'email',
        'telefone',
        'cargo',
        'instituicao',
    ];

    public function atividade(): BelongsTo
    {
        return $this->belongsTo(Atividade::class, 'id_atividade', 'id');
    }
}
