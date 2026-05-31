<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\Actions\Evento\UpdateEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Http\Requests\Evento\UpdateEventoRequest;
use App\Models\Evento;
use App\Models\Ministrante;
use App\Models\Ambiente;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class EventoController extends Controller
{
    public function store(Request $request, StoreEventoAction $action)
    {
        $input = new EventoData(
            $request->input("titulo"),
            $request->input("descricao"),
            EventoFormatoEnum::tryFrom(strtolower($request->input("formato"))),
            $request->array("categorias"),
        );

        $event = $action->execute(auth("web")->id(), $input);

        session(["current_event_id" => $event->id]);

        return response()->json(["success" => true]);
    }

    public function create()
    {
        return inertia("Event/Create/Index");
    }

    public function edit(int $id)
    {
        $evento = Evento::query()
            ->with(['atividades.ministrantes', 'localidade'])
            ->where('id_user', auth('web')->id())
            ->findOrFail($id);

        $ministrantes = Ministrante::query()
            ->where('id_user', auth('web')->id())
            ->get(['id', 'nome', 'email']);

        $idLocal = $evento->id_local ?? $evento->id_localidade ?? null;

        $ambientes = Ambiente::query()
            ->where('id_local', $idLocal)
            ->orWhereNull('id_local') // !!! Remover qando tiver criando local
            ->get(['id', 'nome', 'capacidade']);

        return inertia("Event/Edit/Index", [
            'evento' => $evento,
            'ministrantes' => $ministrantes,
            'ambientes' => $ambientes,
        ]);
    }

    public function update(UpdateEventoRequest $request, UpdateEventoAction $action)
    {
        $event = $action->execute(CurrentEvent::get()->id, $request->validated());

        return response()->json([
            "success" => true,
            "event" => $event,
        ]);
    }
}