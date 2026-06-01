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

        return response()->json([
            "success" => true,
            "evento" => EventoResource::make($evento),
        ]);
    }
}
