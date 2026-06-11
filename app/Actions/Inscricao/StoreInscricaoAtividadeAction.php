<?php

namespace App\Actions\Inscricao;

use App\Exceptions\CreationFailedException;
use App\Models\Atividade;
use App\Models\InscricaoAtividade;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class StoreInscricaoAtividadeAction
{
    public function execute(User $user, int $id_atividade): void
    {
        $atividade = Atividade::query()->findOrFail($id_atividade);
        $this->validate($user, $atividade);

        try {
            DB::transaction(function () use ($user, $id_atividade) {
                if ($inscricao = InscricaoAtividade::query()->where('id_user', $user->id)->where('id_atividade', $id_atividade)->first()) {
                    $inscricao->delete();
                }

                InscricaoAtividade::create([
                    'id_user' => $user->id,
                    'id_atividade' => $id_atividade,
                ]);
            });
        } catch (Throwable $e) {
            throw new CreationFailedException('Ocorreu um erro ao realizar a inscrição na atividade. Tente novamente.', [
                'message' => $e->getMessage(),
                'id_user' => $user->id,
                'id_atividade' => $id_atividade,
            ]);
        }
    }

    private function validate(User $user, Atividade $atividade): void
    {

        $conflito = InscricaoAtividade::where('id_user', $user->id)
            ->whereHas('atividade', fn($q) => $q->where('id_evento', $atividade->id_evento)
                ->where('id', '!=', $atividade->id))
            ->with('atividade')
            ->get()
            ->first(fn($inscricao) =>
                $atividade->data_inicio < $inscricao->atividade->data_fim &&
                $atividade->data_fim > $inscricao->atividade->data_inicio
            );

        if ($conflito) {
            throw ValidationException::withMessages([
                'conflito' => [json_encode([
                    'message' => 'Você já está inscrito em uma atividade neste horário.',
                    'atividade_conflito' => [
                        'id'           => $conflito->atividade->id,
                        'titulo'       => $conflito->atividade->titulo,
                        'data_inicio'  => $conflito->atividade->data_inicio,
                        'data_fim'     => $conflito->atividade->data_fim,
                        'id_inscricao' => $conflito->id,
                    ],
                ])],
            ]);
        }
    }
}