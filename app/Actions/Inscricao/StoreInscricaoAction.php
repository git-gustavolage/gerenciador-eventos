<?php

namespace App\Actions\Inscricao;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Exceptions\LimitReachedException;
use App\Models\Evento;
use App\Models\InscricaoEvento;
use App\Models\User;
use Exception;

class StoreInscricaoAction
{
    public function execute(User $user, int $id_evento): void
    {
        $evento = Evento::query()->findOrFail($id_evento);

        if (InscricaoEvento::query()->where('id_user', $user->id)->where('id_evento', $evento->id)->where('is_ativa', true)->exists()) {
            return;
        }

        $this->validate($user, $evento);

        try {
            InscricaoEvento::create([
                'id_user' => $user->id,
                'id_evento' => $evento->id,
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException('Ocorreu um erro ao realizar a inscrição', [
                'message' => $e->getMessage(),
                'id_user' => $user->id,
                'id_evento' => $id_evento,
            ], $e);
        }
    }

    private function validate(User $user, Evento $evento): void
    {
        if ($evento->is_cancelado) {
            throw new InvalidStateException('Este evento foi cancelado. Não é possível inscrever-se.');
        }

        if ($evento->limite_inscricoes === null) {
            return;
        }

        $total = InscricaoEvento::query()->where('id_evento', $evento->id)->where('is_ativa', true)->count();

        if ($total >= $evento->limite_inscricoes) {
            throw new LimitReachedException('O evento atingiu o limite de inscrições.');
        }
    }
}
