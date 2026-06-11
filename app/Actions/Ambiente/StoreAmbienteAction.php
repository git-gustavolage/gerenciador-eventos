<?php

namespace App\Actions\Ambiente;

use App\Exceptions\CreationFailedException;
use App\Models\Ambiente;
use App\Support\CurrentEvent;
use Exception;
use Illuminate\Support\Facades\Gate;

class StoreAmbienteAction
{
    public function execute(array $data): Ambiente
    {
        $this->validate();

        try {
            return Ambiente::create([
                'nome' => $data['nome'],
                'capacidade' => $data['capacidade'],
                'id_local' => $data['id_local'],
            ]);
        } catch (Exception $e) {
            throw new CreationFailedException('Ocorreu um erro ao cadastrar o novo ambiente. Tente novamente.', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function validate(): void
    {
        $user = auth('web')->user();
        $evento = CurrentEvent::get();

        Gate::forUser($user)->authorize('update', $evento);
    }
}
