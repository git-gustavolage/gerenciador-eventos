<?php

namespace App\Actions\Convites;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Models\Convite;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Gate;

class CancelInviteAction
{
    public function execute(int $id_user, int $id_convite): void
    {
        $user = User::query()->findOrFail($id_user);
        $convite = Convite::query()->findOrFail($id_convite);

        $this->validate($user, $convite);

        if ($convite->cancelado_em !== null) {
            return;
        }

        try {
            $convite->update([
                "cancelado_em" => now(),
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao cancelar o convite. Tente novamente.", [
                "message" => $e->getMessage(),
                "id_user" => $id_user,
                "id_convite" => $id_convite,
            ]);
        }
    }

    private function validate(User $user, Convite $convite): void
    {
        Gate::forUser($user)->authorize("cancel", $convite);

        if ($convite->aceito_em !== null) {
            throw new InvalidStateException("Não é possível cancelar um convite já aceito.");
        }
    }
}
