<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function view()
    {
        $userId = auth("web")->id();

        $eventoIds = Evento::query()
            ->where("id_user", $userId)
            ->orWhereHas("organizadores", fn($q) => $q->where("id_user", $userId))
            ->pluck("id");

        $totalEventos = $eventoIds->count();

        $eventosPublicadosAtivos = Evento::query()
            ->whereIn("id", $eventoIds)
            ->where("is_publicado", true)
            ->where("is_cancelado", false)
            ->where("is_encerrado", false)
            ->where(function ($q) {
                $q->whereNull("data_fim_inscricoes")->orWhere("data_fim_inscricoes", ">=", now());
            })
            ->count("id");

        $totalInscricoes = DB::table("inscricoes")
            ->join("atividades", "inscricoes.id_atividade", "=", "atividades.id")
            ->whereIn("atividades.id_evento", $eventoIds)
            ->count();

        $eventos = Evento::query()
            ->whereIn("id", $eventoIds)
            ->with(["atividades"])
            ->orderByDesc("created_at")
            ->get()
            ->map(function (Evento $evento) {
                $totalInscricoesEvento = DB::table("inscricoes")
                    ->join("atividades", "inscricoes.id_atividade", "=", "atividades.id")
                    ->where("atividades.id_evento", $evento->id)
                    ->count();

                return [
                    "id" => $evento->id,
                    "titulo" => $evento->titulo,
                    "formato" => $evento->formato,
                    "is_publicado" => $evento->is_publicado,
                    "is_cancelado" => $evento->is_cancelado,
                    "data_inicio" => $evento->data_inicio,
                    "data_fim_inscricoes" => $evento->data_fim_inscricoes,
                    "total_atividades" => $evento->atividades->count(),
                    "total_inscricoes" => $totalInscricoesEvento,
                ];
            });

        return inertia("Dashboard", [
            "stats" => [
                "total_eventos" => $totalEventos,
                "eventos_publicados_ativos" => $eventosPublicadosAtivos,
                "total_inscricoes" => $totalInscricoes,
            ],
            "eventos" => $eventos,
        ]);
    }
}
