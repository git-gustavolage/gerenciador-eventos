<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;
use App\Models\Organizador;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function view()
    {
        $userId = Auth::id();

        $eventoIds = Organizador::where('id_user', $userId)->pluck('id_evento');

        $eventos = Evento::withCount(['atividades', 'inscricoesEvento as total_inscricoes'])
            ->whereIn('id', $eventoIds)
            ->orderByDesc('created_at')
            ->get();

        $stats = [
            'total_eventos' => $eventos->count(),
            'eventos_publicados_ativos' => $eventos->filter(fn ($e) => $e->is_publicado &&
                ! $e->is_cancelado &&
                (! $e->data_fim_inscricoes || $e->data_fim_inscricoes > now())
            )->count(),
            'total_inscricoes' => $eventos->sum('total_inscricoes'),
        ];

        $inscricoesEvento = InscricaoEvento::with([
            'evento.local',
            'evento.atividades.ambiente',
            'evento.atividades.ministrantes',
        ])
            ->where('id_user', $userId)
            ->orderByDesc('created_at')
            ->get();

        $inscricoesAtividades = InscricaoAtividade::where('id_user', $userId)
            ->get()
            ->keyBy('id_atividade');

        $eventosParticipante = $inscricoesEvento->map(function ($inscricaoEvento) use ($inscricoesAtividades) {
            $evento = $inscricaoEvento->evento;

            $atividadesInscritas = $evento->atividades
                ->filter(fn ($a) => $inscricoesAtividades->has($a->id))
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'titulo' => $a->titulo,
                    'data_inicio' => $a->data_inicio,
                    'data_fim' => $a->data_fim,
                    'ambiente' => $a->ambiente?->nome,
                    'ministrantes' => $a->ministrantes->pluck('nome')->toArray(),
                    'status_inscricao' => $inscricoesAtividades[$a->id]->status,
                ])
                ->values();

            return [
                'id' => $evento->id,
                'titulo' => $evento->titulo,
                'data_inicio' => $evento->data_inicio,
                'data_fim' => $evento->data_fim,
                'local' => $evento->local?->nome,
                'status_inscricao' => $inscricaoEvento->status,
                'atividades_inscritas' => $atividadesInscritas,
            ];
        })->values();

        return inertia('Dashboard', [
            'stats' => $stats,
            'eventos' => $eventos,
            'eventosParticipante' => $eventosParticipante,
        ]);
    }
}
