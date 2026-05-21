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
        'id_localidade',
        'titulo',
        'descricao',
        'banner_path',
        'formato', // enum: presencial, hibirdo, remoto
        'data_inicio',
        'data_fim',
        'data_inicio_inscricoes',
        'data_fim_inscricoes',
        'limite_inscricoes',
        'is_publicado',
        'is_cancelado',
    ];

    #[Override]
    protected function casts()
    {
        return [
            'formato' => EventoFormatoEnum::class,
            'data_inicio' => 'datatime:d/m/Y H:i:s',
            'data_fim' => 'datatime:d/m/Y H:i:s',
            'data_inicio_inscricoes' => 'datatime:d/m/Y H:i:s',
            'data_fim_inscricoes' => 'datatime:d/m/Y H:i:s',
            'limite_inscricoes' => 'int',
            'is_publicado' => 'boolean',
            'is_cancelado' => 'boolean',
        ];
    }

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'id_evento', 'id');
    }

    public function localidade(): BelongsTo
    {
        return $this->belongsTo(Localidade::class, 'id_localidade', 'id');
    }

    public function organizadores(): HasMany
    {
        return $this->hasMany(Organizador::class, 'id_evento', 'id');
    }
}
 