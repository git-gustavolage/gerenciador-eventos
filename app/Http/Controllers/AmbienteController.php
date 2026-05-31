<?php

namespace App\Http\Controllers;

use App\Actions\Ambiente\StoreAmbienteAction;
use App\Http\Requests\Ambiente\StoreAmbienteRequest;
use App\Http\Resources\Ambiente\AmbienteResource;

class AmbienteController extends Controller
{
    public function store(StoreAmbienteRequest $request, StoreAmbienteAction $action)
    {
        $ambiente = $action->execute($request->validated());

        return response()->json([
            "success" => true,
            "ambiente" => AmbienteResource::make($ambiente),
        ]);
    }
}
