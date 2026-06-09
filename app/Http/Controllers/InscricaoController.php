<?php

namespace App\Http\Controllers;

use App\Actions\Inscricao\StoreInscricaoAction;
use App\Http\Requests\Inscricao\StoreInscricaoRequest;
use App\Models\Atividade;
use App\Models\Evento;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;
use Illuminate\Http\JsonResponse;

class InscricaoController extends Controller
{
    /**
     * Retorna os dados do evento + atividades com status de inscrição do usuário autenticado.
     * Usado para popular o modal/passo de seleção de atividades.
     */
    public function dadosInscricao(int $eventoId): JsonResponse
    {
        $userId = auth('web')->id();

        $evento = Evento::with(['atividades.ministrantes', 'atividades.ambiente', 'local'])
            ->where('is_publicado', true)
            ->where('is_cancelado', false)
            ->findOrFail($eventoId);

        $inscricaoEvento = InscricaoEvento::where('id_user', $userId)
            ->where('id_evento', $eventoId)
            ->first();

        $inscricoesAtividades = InscricaoAtividade::where('id_user', $userId)
            ->whereIn('id_atividade', $evento->atividades->pluck('id'))
            ->pluck('id_atividade');

        $atividades = $evento->atividades
            ->where('is_cancelada', false)
            ->map(function (Atividade $atividade) use ($inscricoesAtividades) {
                $inscrito = $inscricoesAtividades->has($atividade->id);
                $vagasOcupadas = InscricaoAtividade::where('id_atividade', $atividade->id)->count();

                return [
                    'id' => $atividade->id,
                    'titulo' => $atividade->titulo,
                    'descricao' => $atividade->descricao,
                    'data_inicio' => $atividade->data_inicio,
                    'data_fim' => $atividade->data_fim,
                    'ambiente' => $atividade->ambiente?->nome,
                    'ministrantes' => $atividade->ministrantes->pluck('nome'),
                    'limite_participantes' => $atividade->limite_participantes,
                    'vagas_restantes' => $atividade->limite_participantes
                        ? max(0, $atividade->limite_participantes - $vagasOcupadas)
                        : null,
                    'inscrito' => $inscrito,
                ];
            })
            ->values();

        return response()->json([
            'evento' => [
                'id' => $evento->id,
                'titulo' => $evento->titulo,
                'data_inicio' => $evento->data_inicio,
                'data_fim' => $evento->data_fim,
                'local' => $evento->local?->nome,
                'limite_inscricoes' => $evento->limite_inscricoes,
                'inscrito_no_evento' => $inscricaoEvento !== null,
            ],
            'atividades' => $atividades,
        ]);
    }

    /**
     * Processa a inscrição: cria InscricaoEvento e/ou Inscricoes nas atividades selecionadas.
     */
    public function store(StoreInscricaoRequest $request, StoreInscricaoAction $action): JsonResponse
    {
        $action->execute(auth('web')->user(), $request->validated('id_evento'));

        return response()->json(['success' => true], 201);
    }
}
