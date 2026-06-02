<?php

namespace App\Actions\Ministrante;

use App\Exceptions\InvalidStateException;
use App\Exceptions\UpdateFailedException;
use App\Models\Ministrante;
use Exception;

class UpdateMinistranteAction
{
    public function execute(int $id_user, int $id, array $data): void
    {
        $ministrante = Ministrante::query()->findOrFail($id);

        if ($ministrante->id_user !== $id_user) {
            throw new InvalidStateException('Você não tem permissão para editar este ministrante.');
        }

        try {
            $ministrante->update([
                'id_user'     => $id_user, 
            'conta_id'    => $contaVinculada ? $contaVinculada->id : null, 
            'nome'        => $data['nome'],
            'email'       => $data['email'] ?? null,
            'telefone'    => $data['telefone'] ?? null,
            'cargo'       => $data['cargo'] ?? null,
            'instituicao' => $data['instituicao'] ?? null,
            ]);
        } catch (Exception $e) {
            throw new UpdateFailedException('Erro ao atualizar ministrante.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }
}