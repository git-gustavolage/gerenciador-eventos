<?php

namespace App\Actions\Atividade;

use App\Exceptions\InvalidStateException;
use App\Exceptions\UpdateFailedException;
use App\Models\Atividade;
use Exception;

class UpdateAtividadeAction
{
    public function execute(int $id_user, int $id, array $data): void
    {
        $atividade = $this->validate($id_user, $id);

        try {
            $atividade->update([
    'id_ambiente'          => $data['id_ambiente'] ?? null,
    'titulo'               => $data['titulo'],
    'descricao'            => $data['descricao'] ?? null,
    'local'                => $data['local'] ?? null,
    'data_inicio'          => $data['data_inicio'],
    'data_fim'             => $data['data_fim'],
    'limite_participantes' => $data['limite_participantes'] ?? null,
]);
            $novos    = $data['ministrantes'] ?? [];
            $atuais   = $atividade->ministrantes()->pluck('ministrante_id')->toArray();
            $removidos = array_diff($atuais, $novos);
            $adicionados = array_diff($novos, $atuais);

            if ($removidos) {
                $atividade->ministrantes()->detach($removidos);
            }

            if ($adicionados) {
                $pivot = collect($adicionados)
                    ->mapWithKeys(fn($mid) => [$mid => ['status' => 'confirmado']])
                    ->all();
                $atividade->ministrantes()->attach($pivot);
            }
        } catch (Exception $e) {
            throw new UpdateFailedException('Erro ao atualizar atividade.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }

    private function validate(int $id_user, int $id): Atividade
    {
        $atividade = Atividade::query()->with('evento')->findOrFail($id);

        if ($atividade->evento->id_user !== $id_user) {
            throw new InvalidStateException('Você não tem permissão para editar esta atividade.');
        }

        if ($atividade->is_cancelada) {
            throw new InvalidStateException('Não é possível editar uma atividade cancelada.');
        }

        return $atividade;
    }
}