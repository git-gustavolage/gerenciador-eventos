<?php

namespace App\Http\Controllers;

use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Evento;
use App\Models\Local;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrganizadorController extends Controller
{
    public function view()
    {
        $userId = auth('web')->id();

        $eventoIds = Evento::where('id_user', $userId)
            ->orWhereHas('organizadores', fn($q) => $q->where('id_user', $userId))
            ->pluck('id');

        $totalEventos = $eventoIds->count();

        $eventosPublicadosAtivos = Evento::whereIn('id', $eventoIds)
            ->where('is_publicado', true)
            ->where('is_cancelado', false)
            ->where(function ($q) {
                $q->whereNull('data_fim_inscricoes')
                  ->orWhere('data_fim_inscricoes', '>=', now());
            })
            ->count();

        // So consulta inscrições se AMBAS as tabelas existirem
        $podeConsultarInscricoes = Schema::hasTable('inscricoes')
                                && Schema::hasTable('atividades');

        $totalInscricoes = $podeConsultarInscricoes
            ? DB::table('inscricoes')
                ->join('atividades', 'inscricoes.id_atividade', '=', 'atividades.id')
                ->whereIn('atividades.id_evento', $eventoIds)
                ->count()
            : 0;

        $eventos = Evento::whereIn('id', $eventoIds)
            ->with($podeConsultarInscricoes ? ['atividades'] : [])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Evento $evento) use ($podeConsultarInscricoes) {
                $totalInscricoesEvento = $podeConsultarInscricoes
                    ? DB::table('inscricoes')
                        ->join('atividades', 'inscricoes.id_atividade', '=', 'atividades.id')
                        ->where('atividades.id_evento', $evento->id)
                        ->count()
                    : 0;

                return [
                    'id'                  => $evento->id,
                    'titulo'              => $evento->titulo,
                    'formato'             => $evento->formato,
                    'is_publicado'        => $evento->is_publicado,
                    'is_cancelado'        => $evento->is_cancelado,
                    'data_inicio'         => $evento->data_inicio,
                    'data_fim_inscricoes' => $evento->data_fim_inscricoes,
                    'total_atividades'    => $podeConsultarInscricoes ? $evento->atividades->count() : 0,
                    'total_inscricoes'    => $totalInscricoesEvento,
                ];
            });

        return inertia('Organizador/Index', [
            'stats' => [
                'total_eventos'             => $totalEventos,
                'eventos_publicados_ativos' => $eventosPublicadosAtivos,
                'total_inscricoes'          => $totalInscricoes,
            ],
            'eventos' => $eventos,
        ]);
    }

    public function evento(Request $request)
    {
        $evento = CurrentEvent::get($request->input('id'));
        $locais = Local::query()->get();

        if (!$evento) {
            return redirect()->route("eventos.create");
        }

        return inertia("Organizador/Evento/Index", [
            "evento" => EventoResource::make($evento),
            "locais" => LocalResource::collection($locais),
        ]);
    }
}
