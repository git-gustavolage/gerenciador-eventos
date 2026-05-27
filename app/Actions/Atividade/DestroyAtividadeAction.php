<?php

namespace App\Actions\Atividade;

use App\Exceptions\InvalidStateException;
use App\Models\Atividade;

class DestroyAtividadeAction
{
    public function execute(int $id_user, int $id): void
    {
        $atividade = Atividade::query()
            ->with('evento')
            ->findOrFail($id);

        if ($atividade->evento->id_user !== $id_user) {
            throw new InvalidStateException('Você não tem permissão para excluir esta atividade.');
        }

        $atividade->ministrantes()->detach();
        $atividade->delete();
    }
}
