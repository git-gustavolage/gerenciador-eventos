<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

class Atividade extends Model
{
    protected $fillable = [
        'id_evento',
        'titulo',
        'descricao',
        'local',
        'data_inicio',
        'data_fim',
        'is_cancelada',
        'limite_participantes',
    ];

    #[Override]
    protected function casts()
    {
        return [
            'data_inicio' => 'datetime:d/m/Y H:i:s',
            'data_fim' => 'datetime:d/m/Y H:i:s',
            'is_cancelada' => 'boolean',
        ];
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id');
    }

    public function ministrantes(): HasMany
    {
        return $this->hasMany(Ministrante::class, 'id_atividade', 'id');
    }
}
