<?php

namespace App\Actions\Ambiente;

use App\Exceptions\CreationFailedException;
use App\Models\Ambiente;
use Exception;

class StoreAmbienteAction
{
    public function execute(array $data): Ambiente
    {
        try {
            return Ambiente::create([
                "nome" => $data["nome"],
                "capacidade" => $data["capacidade"],
                "id_local" => $data["id_local"],
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao cadastrar o novo ambiente. Tente novamente.", [
                "message" => $e->getMessage(),
            ]);
        }
    }
}
