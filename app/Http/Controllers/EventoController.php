<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\Actions\Evento\UpdateEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Http\Requests\Evento\StoreEventoRequest;
use App\Http\Requests\Evento\UpdateEventoRequest;
use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Inscricao;
use App\Models\InscricaoEvento;
use App\Models\Local;
use App\Support\CurrentEvent;

class EventoController extends Controller
{
    public function create()
    {
        $locais = Local::query()->get();

        return inertia("Event/Create/Index", [
            "locais" => LocalResource::collection($locais),
        ]);
    }

    public function store(StoreEventoRequest $request, StoreEventoAction $action)
{
    $input = new EventoData(
        $request->input("titulo"),
        $request->input("descricao"),
        EventoFormatoEnum::tryFrom(strtolower($request->input("formato"))),
        $request->array("categorias"),
        (int) $request->input("id_local"), 
    );

    $evento = $action->execute(auth("web")->id(), $input);

    CurrentEvent::set($evento->id);

    return response()->json([
        "success" => true,
        "evento" => EventoResource::make($evento),
    ]);
}

    public function update(UpdateEventoRequest $request, UpdateEventoAction $action)
{
    $evento = CurrentEvent::get();
    
    $evento = $action->execute(auth("web")->id(), $evento->id, $request->validated());


    return redirect()->back()->with("success", "Evento atualizado com sucesso!");
}
     public function show(int $id)
    {
        $evento = \App\Models\Evento::with(['atividades.ministrantes', 'atividades.ambiente', 'local'])
            ->findOrFail($id);
 
        $isOwner = auth('web')->check() && auth('web')->id() === $evento->id_user;
 
        if (!$evento->is_publicado || $evento->is_cancelado) {
            if (!$isOwner) {
                abort(403, 'Este evento não está disponível publicamente.');
            }
        }
 
        $userId = auth('web')->id();
 
        return inertia('Event/Publico/Index', [
            'evento'   => $evento,
            'isOwner'  => $isOwner,
 
            
            'inscritoNoEvento' => $userId
                ? InscricaoEvento::where('id_user', $userId)
                    ->where('id_evento', $id)
                    ->exists()
                : false,
 
            'atividadesInscritas' => $userId
                ? Inscricao::where('id_user', $userId)
                    ->whereIn('id_atividade', $evento->atividades->pluck('id'))
                    ->pluck('id_atividade')
                : [],
        ]);
    }

public function index()
{
    $eventos = \App\Models\Evento::with(['local'])
        ->withCount('atividades')
        ->where('is_publicado', true)
        ->where('is_cancelado', false)
        ->orderBy('data_inicio', 'asc')
        ->get();

    return inertia('Event/Publico/List', [
        'eventos' => $eventos
    ]);
}
}
