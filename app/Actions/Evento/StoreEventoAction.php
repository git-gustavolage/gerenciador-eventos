<?php

namespace App\Actions\Evento;

use App\DataTransferObjects\EventoData;
use App\Enum\PerfilEnum;
use App\Exceptions\CreationFailedException;
use App\Models\Evento;
use App\Models\Organizador;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class StoreEventoAction
{
    public function execute(int $id_user, EventoData $input): Evento
    {
        try {
            return DB::transaction(function () use ($id_user, $input) {
                $inicio = Carbon::now()->addMonthNoOverflow()->startOfMonth()->startOfDay();
                $fim = Carbon::now()->addMonthNoOverflow()->endOfMonth()->endOfDay();

                $evento = Evento::create([
                    "titulo" => $input->titulo,
                    "descricao" => $input->descricao,
                    "formato" => $input->formato,
                    "categorias" => $input->categorias,
                    "id_user" => $id_user,
                    "id_local"    => $input->id_local,
                    "is_publicado" => false,
                    "is_cancelado" => false,
                    "is_encerrado" => false,
                    "data_inicio" => $inicio,
                    "data_fim" => $fim,
                ]);

                Organizador::create([
                    "perfil" => PerfilEnum::GESTOR->value,
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
