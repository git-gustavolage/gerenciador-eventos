<?php

namespace App\Actions\Ministrante;

use App\Exceptions\CreationFailedException;
use App\Models\Evento;
use App\Models\Ministrante;
use App\Models\User;
use App\Support\CurrentEvent;
use Illuminate\Support\Facades\Gate;
use Throwable;

class StoreMinistranteAction
{
    public function execute(int $id_user, array $data): void
    {
        $user = User::query()->findOrFail($id_user);
        $evento = CurrentEvent::get();

        $this->validate($user, $evento);

        $contaVinculada = null;

        if (! empty($data['email'])) {
            $contaVinculada = User::query()->where('email', $data['email'])->first();
        }

        try {
            Ministrante::create([
                'id_user' => $id_user,
                'conta_id' => $contaVinculada ? $contaVinculada->id : null,
                'nome' => $data['nome'],
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'cargo' => $data['cargo'] ?? null,
                'instituicao' => $data['instituicao'] ?? null,
            ]);
        } catch (Throwable $e) {
            throw new CreationFailedException('Ocorreu um erro ao cadastrar o novo ministrante. Tente novamente.');
        }
    }

    private function validate(User $user, Evento $evento): void
    {
        Gate::forUser($user)->authorize('update', $evento);
    }
}
