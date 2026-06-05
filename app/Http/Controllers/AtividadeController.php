<?php

namespace App\Http\Controllers;

use App\Actions\Atividade\CancelAtividadeAction;
use App\Actions\Atividade\StoreAtividadeAction;
use App\Actions\Atividade\UpdateAtividadeAction;
use App\Http\Requests\Atividade\StoreAtividadeRequest;
use App\Http\Requests\Atividade\UpdateAtividadeRequest;
use App\Http\Resources\AtividadeResource;
use App\Support\CurrentEvent;

class AtividadeController extends Controller
{
    public function index()
    {
        $evento = CurrentEvent::get();
        $atividades = $evento
            ->atividades()
            ->with(["ambiente", "ministrantes"])
            ->where("is_cancelada", false)
            ->orderBy("data_inicio")
            ->get();

        return response()->json([
            "data" => AtividadeResource::collection($atividades),
        ]);
    }

    public function store(StoreAtividadeRequest $request, StoreAtividadeAction $action)
    {
        $action->execute(auth("web")->id(), $request->validated());

        return response()->json(["success" => true], 201);
    }

    public function update(int $id, UpdateAtividadeRequest $request, UpdateAtividadeAction $action)
    {
        $action->execute(auth("web")->id(), $id, $request->validated());

        return response()->json(["success" => true]);
    }

    public function cancel(int $id, CancelAtividadeAction $action)
    {
        $action->execute(auth("web")->id(), $id);

        return response()->noContent();
    }
}
