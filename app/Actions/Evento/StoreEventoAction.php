<?php

namespace App\Actions\Evento;

use App\DataTransferObjects\EventoData;
use App\Exceptions\CreationFailedException;
use App\Models\Evento;
use App\Models\Organizador;
use Exception;
use Illuminate\Support\Facades\DB;

class StoreEventoAction
{
    public function execute(int $id_user, EventoData $input): Evento
    {
        try {
            return DB::transaction(function () use ($id_user, $input) {
                $evento = Evento::create([
                    "titulo" => $input->titulo,
                    "descricao" => $input->descricao,
                    "formato" => $input->formato,
                    "categorias" => $input->categorias,
                    "id_user" => $id_user,
                    "is_publicado" => false,
                    "is_cancelado" => false,
                ]);

                Organizador::create([
                    "id_evento" => $evento->id,
                    "id_user" => $id_user,
                ]);

                return $evento;
            });
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao criar o evento.", [
                "message" => $e->getMessage(),
                "id_user" => $id_user,
            ]);
        }
    }
}
