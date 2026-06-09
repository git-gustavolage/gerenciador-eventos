<?php

namespace App\Http\Controllers;

use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\InscricaoAtividadeResource;
use App\Http\Resources\InscricaoEventoResource;
use App\Models\Evento;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;

class ParticipanteController extends Controller
{
    public function view()
    {
        $inscricoes = InscricaoEvento::query()->where('id_user', auth('web')->id())->get();

        return inertia('Participante/Index', [
            'inscricoes' => InscricaoEventoResource::collection($inscricoes),
        ]);
    }

    public function evento(int $id)
    {
        $evento = Evento::query()->with(['atividades.ministrantes', 'atividades.ambiente', 'local'])->findOrFail($id);

        $inscricoes = InscricaoAtividade::query()
            ->with(['atividade'])
            ->where('id_user', auth('web')->id())
            ->get();

        return inertia('Participante/Evento/Index', [
            'evento' => EventoResource::make($evento),
            'inscricoes' => InscricaoAtividadeResource::collection($inscricoes),
        ]);
    }
}
