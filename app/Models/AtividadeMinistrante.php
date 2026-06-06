<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AtividadeMinistrante extends Model
{
    protected $fillable = [
        'id_atividade',
        'id_ministrante',
    ];

    public function atividade(): BelongsTo
    {
        return $this->belongsTo(Atividade::class, 'id_atividade', 'id');
    }

    public function ministrante(): BelongsTo
    {
        return $this->belongsTo(Ministrante::class, 'id_ministrante', 'id');
    }
}
