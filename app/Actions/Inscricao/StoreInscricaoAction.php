<?php

namespace App\Actions\Inscricao;

use App\Enum\InscricaoStatusEnum;
use App\Models\Atividade;
use App\Models\Evento;
use App\Models\Inscricao;
use App\Models\InscricaoEvento;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreInscricaoAction
{
    /**
     * @param  int    $userId
     * @param  int    $eventoId
     * @param  array{
     *     nome: string,
     *     telefone: string,
     *     inscrever_evento: bool,
     *     atividades: int[]
     * }              $data
     * @return array{
     *     inscrito_no_evento: bool,
     *     atividades_inscritas: int[],
     *     atividades_ja_inscritas: int[]
     * }
     */
    public function execute(int $userId, int $eventoId, array $data): array
    {
        return DB::transaction(function () use ($userId, $eventoId, $data) {

            $evento = Evento::where('is_publicado', true)
                ->where('is_cancelado', false)
                ->findOrFail($eventoId);

            // Atualiza nome e telefone do participante (campos do perfil)
            User::where('id', $userId)->update([
                'nome'     => $data['nome'],
                'telefone' => $data['telefone'],
            ]);

            $inscritoNoEvento    = false;
            $atividadesInscritas = [];
            $atividadesJaInscritas = [];

            // ── Inscrição no evento geral ──────────────────────────────────────
            if (!empty($data['inscrever_evento'])) {
                $this->validarLimiteEvento($evento);

                InscricaoEvento::firstOrCreate(
                    ['id_user' => $userId, 'id_evento' => $eventoId],
                    ['status'  => InscricaoStatusEnum::Pendente->value]
                );

                $inscritoNoEvento = true;
            }

            // ── Inscrição nas atividades ───────────────────────────────────────
            foreach (($data['atividades'] ?? []) as $atividadeId) {
                $atividade = Atividade::where('id_evento', $eventoId)
                    ->where('is_cancelada', false)
                    ->findOrFail($atividadeId);

                // Já inscrito → apenas registra no retorno
                $jaExiste = Inscricao::where('id_user', $userId)
                    ->where('id_atividade', $atividadeId)
                    ->exists();

                if ($jaExiste) {
                    $atividadesJaInscritas[] = $atividadeId;
                    continue;
                }

                // Verifica vagas
                if ($atividade->limite_participantes !== null) {
                    $ocupadas = Inscricao::where('id_atividade', $atividadeId)
                        ->whereIn('status', [
                            InscricaoStatusEnum::Pendente->value,
                            InscricaoStatusEnum::Confirmado->value,
                        ])
                        ->count();

                    if ($ocupadas >= $atividade->limite_participantes) {
                        throw ValidationException::withMessages([
                            'atividades' => "A atividade \"{$atividade->titulo}\" não possui mais vagas.",
                        ]);
                    }
                }

                Inscricao::create([
                    'id_user'      => $userId,
                    'id_atividade' => $atividadeId,
                    'status'       => InscricaoStatusEnum::Pendente->value,
                ]);

                $atividadesInscritas[] = $atividadeId;
            }

            return [
                'inscrito_no_evento'      => $inscritoNoEvento,
                'atividades_inscritas'    => $atividadesInscritas,
                'atividades_ja_inscritas' => $atividadesJaInscritas,
            ];
        });
    }

    private function validarLimiteEvento(Evento $evento): void
    {
        if ($evento->limite_inscricoes === null) {
            return;
        }

        $total = InscricaoEvento::where('id_evento', $evento->id)
            ->whereIn('status', [
                InscricaoStatusEnum::Pendente->value,
                InscricaoStatusEnum::Confirmado->value,
            ])
            ->count();

        if ($total >= $evento->limite_inscricoes) {
            throw ValidationException::withMessages([
                'inscrever_evento' => 'O evento atingiu o limite de inscrições.',
            ]);
        }
    }
}