<?php

namespace App\Actions\Evento;

use App\Exceptions\InvalidStateException;
use App\Exceptions\UpdateFailedException;
use App\Models\Evento;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Throwable;

class PublishEventoAction
{
    public function execute(int $id_user, int $id_evento): void
    {
        $user = User::query()->findOrFail($id_user);
        $evento = Evento::query()->findOrFail($id_evento);

        if ($evento->is_publicado) {
            return;
        }

        $this->validate($user, $evento);

        try {
            $evento->update([
                'is_publicado' => true,
            ]);
        } catch (Throwable $e) {
            throw new UpdateFailedException('Ocorreu um erro ao publicar o evento, tente novamente.', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function validate(User $user, Evento $evento): void
    {
        Gate::forUser($user)->authorize('publish', $evento);

        if ($evento->is_cancelado) {
            throw new InvalidStateException('Não é possível publicar um evento cancelado.');
        }

        if ($evento->is_encerrado) {
            throw new InvalidStateException('Não é possível publicar um evento encerrado.');
        }
    }
}
