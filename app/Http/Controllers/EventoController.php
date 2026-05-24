<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
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
}
