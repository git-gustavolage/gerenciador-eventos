<?php

namespace App\Actions\Atividade;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Models\Atividade;
use App\Models\Evento;
use Exception;
use Illuminate\Support\Facades\Log; 

class StoreAtividadeAction
{
    public function execute(int $id_user, array $data): void
    {
        $this->validate($id_user, $data);

        try {
            $atividade = Atividade::create([
                'id_evento'            => $data['id_evento'],
                'id_ambiente'          => $data['id_ambiente'] ?? null,
                'titulo'               => $data['titulo'],
                'descricao'            => $data['descricao'] ?? null,
                'local'                => $data['local'] ?? null,
                'data_inicio'          => $data['data_inicio'],
                'data_fim'             => $data['data_fim'],
                'is_cancelada'         => false,
                'limite_participantes' => $data['limite_participantes'] ?? null,
            ]);
            
            if (!empty($data['ministrantes'])) {
                $pivot = collect($data['ministrantes'])
                    ->mapWithKeys(fn($id) => [$id => ['status' => 'confirmado']])
                    ->all();

                $atividade->ministrantes()->sync($pivot);
            }
        } catch (Exception $e) {
            Log::error('Erro ao cadastrar atividade', [
                'exception' => $e,
                'user_id' => $id_user,
                'dados' => $data,
            ]);

            throw new CreationFailedException(
                'Não foi possível cadastrar a atividade. Tente novamente mais tarde.'
            );
        }
    } 

    private function validate(int $id_user, array $data): void
    {
        $evento = Evento::query()->findOrFail($data['id_evento']);

        if ($evento->id_user !== $id_user) {
            throw new InvalidStateException('Você não tem permissão para cadastrar atividades neste evento.');
        }

        if ($evento->is_cancelado) {
            throw new InvalidStateException('Não é possível cadastrar a atividade pois este evento foi cancelado.');
        }
    }
}