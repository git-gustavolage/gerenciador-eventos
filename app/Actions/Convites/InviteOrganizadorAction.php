<?php

namespace App\Actions\Convites;

use App\Exceptions\CreationFailedException;
use App\Mail\InviteOrganizadorMail;
use App\Models\Convite;
use App\Models\Evento;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InviteOrganizadorAction
{
    public function execute(int $id_inviter, int $id_evento, string $email): void
    {
        $user = User::query()->findOrFail($id_inviter);
        $evento = Evento::query()->findOrFail($id_evento);

        $this->validate($user, $evento);

        try {
            DB::transaction(function () use ($evento, $user, $email) {
                $ttl = $this->ttl();

                $token = Str::uuid()->toString();

                Convite::query()
                    ->where("id_evento", $evento->id)
                    ->where("email", $email)
                    ->whereNull("aceito_em")
                    ->whereNull("cancelado_em")
                    ->update([
                        "cancelado_em" => now(),
                    ]);

                Convite::create([
                    "id_evento" => $evento->id,
                    "email" => $email,
                    "token" => $token,
                    "expira_em" => $ttl,
                ]);

                $link = route("convites.view", ["token" => $token]);

                $mail = (new InviteOrganizadorMail($user->nome, $evento->titulo, $link))->afterCommit();

                Mail::to($email)->queue($mail);
            });
        } catch (Exception $e) {
            throw new CreationFailedException("Ocorreu um erro ao gerar o convite. Tente novamente.", [
                "message" => $e->getMessage(),
                "payload" => ["id_inviter" => $id_inviter, "id_evento" => $id_evento, "email" => $email],
            ]);
        }
    }

    private function validate(User $user, Evento $evento): void
    {
        Gate::forUser($user)->authorize("inviteOrganizador", $evento);
    }

    private function ttl(): Carbon
    {
        return now()->addDays(7);
    }
}
