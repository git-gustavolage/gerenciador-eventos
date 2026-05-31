<?php

namespace App\Actions\Convites;

use App\Enum\PerfilEnum;
use App\Exceptions\AlreadyUsedTokenException;
use App\Exceptions\CreationFailedException;
use App\Exceptions\ExpiredInviteException;
use App\Models\Convite;
use App\Models\Evento;
use App\Models\Organizador;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class AcceptInviteAction
{
    public function execute(int $id_user, string $token): Evento
    {
        $convite = Convite::query()->where("token", $token)->firstOrFail();
        $user = User::query()->where("email", $convite->email)->first();
        $evento = Evento::query()->findOrFail($convite->id_evento);

        if ($id_user !== $user->id) {
            throw new AuthorizationException("Este link não condiz com seu perfil. Solicite um novo link.");
        }

        if ($convite->aceito_em !== null) {
            throw new AlreadyUsedTokenException();
        }

        if ($convite->expira_em !== null && $convite->expira_em->isPast()) {
            throw new ExpiredInviteException();
        }

        if (Organizador::query()->where("id_user", $user->id)->where("id_evento", $convite->id_evento)->exists()) {
            return $evento;
        }

        try {
            return DB::transaction(function () use ($user, $convite, $evento) {
                Organizador::create([
                    "perfil" => PerfilEnum::ORGANIZADOR,
                    "id_user" => $user->id,
                    "id_evento" => $convite->id_evento,
                ]);

                $convite->update([
                    "aceito_em" => now(),
                ]);

                return $evento;
            });
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao aceitar o convite. Solicite um novo link e tente novamente.", [
                "message" => $e->getMessage(),
                "token" => $token,
            ]);
        }
    }
}
