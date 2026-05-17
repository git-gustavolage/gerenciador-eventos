<?php

namespace App\Actions\Ministrante;

use App\Exceptions\CreationFailedException;
use App\Models\Ministrante;
use Exception;

class StoreMinistranteAction
{
    public function execute(int $id_user, array $data): void
    {

        // validar user <=> atividade

        try {
            Ministrante::create([
                $data['id_atividade'],
                $data['nome'],
                $data['email'],
                $data['telefone'] ?? null,
                $data['cargo'] ?? null,
                $data['instituicao'] ?? null,
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException('Erro ao salvar novo ministrante.', [
                'message' => $e->getMessage(),
                'user_id' => auth('web')->id(),
            ]);
        }
    }
}
