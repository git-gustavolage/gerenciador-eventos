<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Models\Evento;
use App\Models\Ministrante;
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

        $action->execute(auth('web')->id(), $input);

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

        return inertia("Event/Edit/Index", [
            'evento'       => $evento,
            'ministrantes' => $ministrantes,
        ]);
    }
}


