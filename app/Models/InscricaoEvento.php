<?php

namespace App\Models;

use App\Enum\InscricaoStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InscricaoEvento extends Model
{
    protected $table = 'inscricoes_evento';

    protected $fillable = [
        'id_user',
        'id_evento',
        'status',
        'compareceu',
    ];

    public function casts(): array
    {
        return [
            'status' => InscricaoStatusEnum::class,
            'compareceu' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id');
    }
}
