<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Override;

class Atividade extends Model
{
    protected $fillable = [
        "id_evento",
        "id_ambiente",
        "titulo",
        "descricao",
        "data_inicio",
        "data_fim",
        "is_cancelada",
        "data_cancelamento",
        "limite_participantes",
    ];

    #[Override]
    protected function casts(): array
    {
        return [
            "data_inicio" => "datetime",
            "data_fim" => "datetime",
            "data_cancelamento" => "datetime",
            "is_cancelada" => "boolean",
        ];
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class, "id_evento", "id");
    }

    public function ambiente(): BelongsTo
    {
        return $this->belongsTo(Ambiente::class, "id_ambiente", "id");
    }

    public function inscricoes(): HasMany
{
    return $this->hasMany(InscricaoAtividade::class, 'id_atividade', 'id');
}

    public function ministrantes(): BelongsToMany
    {
        return $this->belongsToMany(Ministrante::class, "atividade_ministrante", "atividade_id", "ministrante_id");
    }
}
