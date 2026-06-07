<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ministrante extends Model
{
    protected $fillable = [
        'id_user',
        'conta_id',
        'nome',
        'email',
        'telefone',
        'cargo',
        'instituicao',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function atividades(): BelongsToMany
    {
        return $this->belongsToMany(Atividade::class, 'atividades_ministrantes', 'id_ministrante', 'id_atividade');
    }
}
