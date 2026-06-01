<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\Actions\Evento\UpdateEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Http\Requests\Evento\StoreEventoRequest;
use App\Http\Requests\Evento\UpdateEventoRequest;
use App\Http\Resources\Local\LocalResource;
use App\Models\Evento;
use App\Models\Ministrante;
use App\Models\Ambiente;
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

        return response()->json(["success" => true]);
    }

    public function edit(int $id)
    {
        $evento = Evento::query()
            ->with(["atividades.ministrantes", "local"])
            ->where("id_user", auth("web")->id())
            ->findOrFail($id);

        $user = auth("web")->user();

        if (!$user->can("view", $evento)) {
            CurrentEvent::forget();
            return redirect()->route("eventos.create");
        }

        $ministrantes = Ministrante::query()
            ->where("id_user", auth("web")->id())
            ->get(["id", "nome", "email"]);

        $idLocal = $evento->id_local;

        $ambientes = Ambiente::query()
            ->where("id_local", $idLocal)
            ->get(["id", "nome", "capacidade"]);

        return inertia("Event/Edit/Index", [
            "evento" => $evento,
            "ministrantes" => $ministrantes,
            "ambientes" => $ambientes,
        ]);
    }

    public function update(UpdateEventoRequest $request, UpdateEventoAction $action)
    {
        $event = $action->execute(auth('web')->id(), CurrentEvent::get()->id, $request->validated());

        return response()->json([
            "success" => true,
            "event" => $event,
        ]);
    }
}
