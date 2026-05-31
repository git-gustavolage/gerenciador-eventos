<?php

namespace App\Http\Controllers;

use App\Actions\Organizadores\DestroyOrganizadorAction;
use App\Actions\Organizadores\ListOrganizadoresAction;
use App\Http\Resources\Organizador\OrganizadorResource;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class OrganizadoresController
{
    public function view()
    {
        $evento = CurrentEvent::get();

        return inertia("Organizador/Organizadores/Index", [
            "evento" => $evento,
        ]);
    }

    public function index(Request $request, ListOrganizadoresAction $action)
    {
        $id_evento = $request->input("id_evento");

        $organizadores = $action->execute($id_evento);

        return response()->json([
            "data" => OrganizadorResource::collection($organizadores),
        ]);
    }

    public function destroy(int $id, DestroyOrganizadorAction $action)
    {
        $action->execute(auth("web")->id(), $id);

        return response()->noContent();
    }
}
