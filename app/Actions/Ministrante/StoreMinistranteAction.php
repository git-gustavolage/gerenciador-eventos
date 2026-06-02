<?php

namespace App\Actions\Ministrante;

use App\Exceptions\CreationFailedException;
use App\Models\Ministrante;
use Exception;

class StoreMinistranteAction
{
    public function execute(int $id_user, array $data): void
    {
        try {
            Ministrante::create([
                'id_user'      => $id_user,
                'nome'         => $data['nome'],
                'email'        => $data['email'] ?? null,
                'telefone'     => $data['telefone'] ?? null,
                'cargo'        => $data['cargo'] ?? null,
                'instituicao'  => $data['instituicao'] ?? null,
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException('Erro ao salvar novo ministrante.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }
}