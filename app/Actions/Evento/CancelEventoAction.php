<?php

namespace App\Actions\Evento;

use App\Exceptions\InvalidStateException;
use App\Mail\EventoCanceladoMail;
use App\Models\Evento;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;

class CancelEventoAction
{
    public function execute(int $id_user, int $id_evento): void
    {
        $evento = Evento::query()->findOrFail($id_evento);

        if ($evento->is_cancelado) {
            return;
        }

        $user = User::query()->findOrFail($id_evento);

        $this->validate($user, $evento);

        DB::transaction(function () use ($id_user, $evento) {
            DB::table('atividades')
                ->where('id_evento', $evento->id)
                ->where('is_cancelada', false)
                ->update([
                    'is_cancelada' => 1,
                    'data_cancelamento' => now(),
                    'cancelada_por' => $id_user,
                ]);

            $evento->update([
                'is_cancelado' => true,
                'cancelado_por' => $id_user,
            ]);
        });

        $arr_id_user = $evento->inscricoesEvento()->distinct()->pluck('id_user');

        if ($arr_id_user->isNotEmpty()) {
            $inscritos = User::query()->whereIn('id', $arr_id_user)->get();
            foreach ($inscritos as $inscrito) {
                Mail::to($inscrito->email)->queue(new EventoCanceladoMail($evento, $inscrito));
            }
        }
    }

    public function validate(User $user, Evento $evento): void
    {
        Gate::forUser($user)->authorize('cancel', $evento);

        if ($evento->is_encerrado) {
            throw new InvalidStateException('Não é possível cancelar um evento encerrado.');
        }
    }
}
