<?php

namespace App\Actions\Atividade;

use App\Exceptions\UpdateFailedException;
use App\Models\Atividade;
use App\Models\Ministrante;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Throwable;

class DesassociarMinistranteAtividadeAction
{
    public function execute(User $user, int $id_ministrante, int $id_atividade): void
    {
        $ministrante = Ministrante::query()->findOrFail($id_ministrante);
        $atividade = Atividade::query()->findOrFail($id_atividade);

        $this->validate($user, $ministrante, $atividade);

        try {
            $atividade->ministrantes()->detach($ministrante->id);
        } catch (Throwable $e) {
            throw new UpdateFailedException('Ocorreu um erro ao desassociar o ministrante a essa atividade. Tente novamente.', [
                'message' => $e->getMessage(),
                'id_user' => $user->id,
                'id_ministrante' => $id_ministrante,
                'id_atividade' => $id_atividade,
            ], $e);
        }
    }

    private function validate(User $user, Ministrante $ministrante, Atividade $atividade): void
    {
        Gate::forUser($user)->authorize('update', $atividade);
    }
}
