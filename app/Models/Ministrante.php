<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ministrante extends Model
{
    protected $fillable = [
       
        'nome',
        'email',
        'telefone',
        'cargo',
        'instituicao',
    ];

    public function atividades(): BelongsToMany
{
    return $this->belongsToMany(
    Atividade::class,
    'atividade_ministrante',
    'ministrante_id',
    'atividade_id'
);
}

    
}
