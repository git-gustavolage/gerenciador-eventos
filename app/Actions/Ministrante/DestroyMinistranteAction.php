<?php

namespace App\Actions\Ministrante;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Models\Ministrante;
use Exception;

class DestroyMinistranteAction
{
    public function execute(int $id_user, int $id_ministrante): void
    {
        $ministrante = Ministrante::query()->findOrFail($id_ministrante);

        if ($ministrante->id_user !== $id_user) {
            throw new InvalidStateException('Você não tem permissão para excluir este ministrante.');
        }

        try {
            $ministrante->atividades()->detach();
            $ministrante->delete();
        } catch (Exception $e) {
            throw new CreationFailedException('Erro ao deletar ministrante.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }
}