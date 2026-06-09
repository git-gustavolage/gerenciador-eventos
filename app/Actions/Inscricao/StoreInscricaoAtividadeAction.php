<?php

namespace App\Actions\Inscricao;

use App\Exceptions\CreationFailedException;
use App\Models\Atividade;
use App\Models\InscricaoAtividade;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class StoreInscricaoAtividadeAction
{
    public function execute(User $user, int $id_atividade): void
    {
        $atividade = Atividade::query()->findOrFail($id_atividade);
        $this->validate($user, $atividade);

        try {
            DB::transaction(function () use ($user, $id_atividade) {
                if ($inscricao = InscricaoAtividade::query()->where('id_user', $user->id)->where('id_atividade', $id_atividade)->first()) {
                    $inscricao->delete();
                }

                InscricaoAtividade::create([
                    'id_user' => $user->id,
                    'id_atividade' => $id_atividade,
                ]);
            });
        } catch (Throwable $e) {
            throw new CreationFailedException('Ocorreu um erro ao realizar a inscrição na atividade. Tente novamente.', [
                'message' => $e->getMessage(),
                'id_user' => $user->id,
                'id_atividade' => $id_atividade,
            ]);
        }
    }

    private function validate(User $user, Atividade $atividade): void
    {
        // TODO: validar se user esta incrito no evento
    }
}
