<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InscricaoAtividade extends Model
{
    protected $table = 'inscricoes'; // <-- aponta para a tabela correta

    protected $fillable = [
        'id_atividade',
        'id_user',
        'status',
        'compareceu',
    ];

    protected function casts(): array
    {
        return [
            'compareceu' => 'boolean',
        ];
    }

    public function atividade(): BelongsTo
    {
        return $this->belongsTo(Atividade::class, 'id_atividade', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}