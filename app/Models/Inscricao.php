<?php

namespace App\Models;

use App\Enum\InscricaoStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class Inscricao extends Model
{
    protected $table = 'inscricoes';

    protected $fillable = [
        'id_user',
        'id_atividade',
        'status',
        'compareceu',
    ];

    #[Override]
    protected function casts(): array
    {
        return [
            'status'     => InscricaoStatusEnum::class,
            'compareceu' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function atividade(): BelongsTo
    {
        return $this->belongsTo(Atividade::class, 'id_atividade', 'id');
    }
}