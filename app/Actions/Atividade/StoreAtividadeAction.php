<?php

namespace App\Actions\Atividade;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Models\Atividade;
use App\Models\Evento;
use Exception;

class StoreAtividadeAction
{
    public function execute(int $id_user, array $data): void
    {
        $this->validate($id_user, $data);

        try {
            $atividade = Atividade::create([
                'id_evento'            => $data['id_evento'],
                'titulo'               => $data['titulo'],
                'descricao'            => $data['descricao'] ?? null,
                'local'                => $data['local'] ?? null,
                'data_inicio'          => $data['data_inicio'],
                'data_fim'             => $data['data_fim'],
                'is_cancelada'         => false,
                'limite_participantes' => $data['limite_participantes'] ?? null,
            ]);

            if (!empty($data['ministrantes'])) {
                $atividade->ministrantes()->sync($data['ministrantes']);
            }
        } catch (Exception $e) {
            throw new CreationFailedException('Erro ao cadastrar nova atividade.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
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

