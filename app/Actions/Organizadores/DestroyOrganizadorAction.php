<?php

namespace App\Actions\Organizadores;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Exceptions\NotFoundException;
use App\Models\Evento;
use App\Models\Organizador;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DestroyOrganizadorAction
{
    public function execute(int $id_user, int $id_organizador): void
    {
        $organizador = Organizador::query()->find($id_organizador);

        $this->validate($id_user, $organizador);

        try {
            Organizador::query()->where("id_evento", $organizador->id_evento)->where("id_user", $organizador->id_user)->delete();
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro o organizador. Tente novamente.", [
                "message" => $e->getMessage(),
            ]);
        }
    }

    private function validate(int $id_user, ?Organizador $organizador): void
    {
        if (!$organizador) {
            throw new NotFoundException();
        }

        $evento = Evento::query()->find($organizador->id_evento);

        if (!$evento) {
            throw new NotFoundException();
        }

        if ($evento->is_cancelado || $evento?->is_encerrado) {
            throw new InvalidStateException("Não é mais possível fazer alterações neste evento.");
        }

        if ($organizador->id_user == $evento->id_user) {
            throw new AuthorizationException("Não é possivel remover o gestor do evento.");
        }

        $sameScope = Organizador::query()
            ->where("id_evento", $evento->id)
            ->whereHas("user", function ($query) use ($id_user) {
                $query->whereKey($id_user);
            })
            ->exists();

        if (!$sameScope) {
            throw new AuthorizationException("Você não possui permissão para remover este organizador.");
        }
    }
}
