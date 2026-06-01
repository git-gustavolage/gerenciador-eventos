<?php

namespace App\Actions\Atividade;

use App\Exceptions\CreationFailedException;
use App\Models\Atividade;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class DestroyAtividadeAction
{
    public function execute(int $id_user, int $id_atividade): void
    {
        $user = User::query()->findOrFail($id_user);
        $atividade = Atividade::query()->with("evento")->findOrFail($id_atividade);

        $this->validate($user, $atividade);

        try {
            DB::transaction(function () use ($atividade) {
                $atividade->ministrantes()->detach();
                $atividade->delete();
            });
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao deletar a atividade", [
                "message" => $e->getMessage(),
                "id_user" => $id_user,
                "id_atividade" => $id_atividade,
            ]);
        }
    }

    private function validate(User $user, Atividade $atividade): void
    {
        Gate::forUser($user)->authorize("update", $atividade);
    }
}
