<?php

namespace App\Actions\Inscricao;

use App\Models\InscricaoAtividade;
use App\Models\User;

class DestoryInscricaoAtividadeAction
{
    public function execute(User $user, int $id_inscricao): void
    {
        $inscricao = InscricaoAtividade::query()->findOrFail($id_inscricao);

        $inscricao->delete();
    }

    private function validate(User $user, InscricaoAtividade $inscricao): void
    {
        // TODO: validar se user esta incrito no evento e na atividade
    }
}
