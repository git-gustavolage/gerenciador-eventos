<?php

namespace App\Models;

use App\Enum\EventoFormatoEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

class Evento extends Model
{
    protected $fillable = [
        "titulo",
        "descricao",
        "formato",
        "categorias",
        "banner_path",
        "data_inicio",
        "data_fim",
        "data_inicio_inscricoes",
        "data_fim_inscricoes",
        "limite_inscricoes",
        "id_user",
        "id_localidade",
        "is_publicado",
        "is_cancelado",
    ];

    #[Override]
    protected function casts(): array
    {
        return [
            "formato"               => EventoFormatoEnum::class,
            "categorias"            => "array",
            "data_inicio"           => "datetime",  
            "data_fim"              => "datetime", 
            "data_inicio_inscricoes"=> "datetime", 
            "data_fim_inscricoes"   => "datetime", 
            "limite_inscricoes"     => "int",
            "is_publicado"          => "boolean",
            "is_cancelado"          => "boolean",
        ];
    }

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, "id_evento", "id");
    }

    public function localidade(): BelongsTo
    {
        return $this->belongsTo(Localidade::class, "id_localidade", "id");
    }

    public function organizadores(): HasMany
    {
        return $this->hasMany(Organizador::class, "id_evento", "id");
    }
}