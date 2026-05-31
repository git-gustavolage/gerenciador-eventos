<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        "limite_participantes",
    ];

    #[Override]
    protected function casts(): array
    {
        return [
            "data_inicio" => "datetime:Y-m-d H:i:s",
            "data_fim" => "datetime:Y-m-d H:i:s",
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

    public function ministrantes(): BelongsToMany
    {
        return $this->belongsToMany(Ministrante::class, "atividade_ministrante", "atividade_id", "ministrante_id");
    }
}
