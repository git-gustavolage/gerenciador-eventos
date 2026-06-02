<?php

namespace App\Actions\Ministrante;

use App\Exceptions\InvalidStateException;
use App\Models\Ministrante;

class ConfirmarConviteAction
{
    public function execute(int $id_user, int $atividade_id): void
    {
        $ministrante = Ministrante::query()
            ->where('id_user', $id_user)
            ->firstOrFail();

        $pivot = $ministrante->atividades()
            ->wherePivot('atividade_id', $atividade_id)
            ->first();

        if (!$pivot) {
            throw new InvalidStateException('Convite não encontrado.');
        }

        $ministrante->atividades()->updateExistingPivot($atividade_id, ['status' => 'confirmado']);
    }
}