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
            Atividade::create([
                $data['id_evento'],
                $data['titulo'],
                $data['descricao'],
                $data['local'],
                $data['data_inicio'],
                $data['data_fim'],
                $data['is_cancelada'],
                $data['limite_participantes'],
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException('Erro ao cadastrar nova atividade.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }

    private function validate(int $id_user, array $data)
    {
        $evento = Evento::query()->findOrFail($data['id_evento']);

        if ($evento->is_cancelado) {
            throw new InvalidStateException('Não é possivel cadastrar a atividade pois este evento foi cancelado.');
        }
    }
}
 