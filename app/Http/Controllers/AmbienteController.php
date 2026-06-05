<?php

namespace App\Http\Controllers;

use App\Actions\Ambiente\StoreAmbienteAction;
use App\Http\Requests\Ambiente\StoreAmbienteRequest;
use App\Http\Resources\Ambiente\AmbienteResource;
use App\Support\CurrentEvent;

class AmbienteController extends Controller
{
    public function store(StoreAmbienteRequest $request, StoreAmbienteAction $action)
    {
        $data = $request->validated();

        if (!$request->input("id_local")) {
            $data["id_local"] = CurrentEvent::getId();
        }

        $ambiente = $action->execute($data);

        return response()->json([
            "success" => true,
            "ambiente" => AmbienteResource::make($ambiente),
        ]);
    }
}
