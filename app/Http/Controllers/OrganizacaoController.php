<?php

namespace App\Http\Controllers;

use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Ambiente;
use App\Models\Evento;
use App\Models\Local;
use App\Models\Ministrante;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class OrganizacaoController extends Controller
{
    public function view(Request $request)
    {
        $evento = CurrentEvent::get($request->input("id"));

        return inertia("Organizacao/Index", [
            "evento" => $evento,
        ]);
    }

    public function edit()
    {
        $user = auth("web")->user();
        $evento = CurrentEvent::get();

        if (!$user->can("show", $evento)) {
            CurrentEvent::forget();
            return redirect()->route("eventos.create");
        }

        $locais = Local::query()->get();

        if (!$evento) {
            return redirect()->route("eventos.create");
        }

        return inertia("Organizador/Evento/Index", [
            "evento" => EventoResource::make($evento),
            "locais" => LocalResource::collection($locais),
        ]);
    }

    public function organizadores()
    {
        $evento = CurrentEvent::get();

        return inertia("Organizador/Organizadores/Index", [
            "evento" => $evento,
        ]);
    }

    public function atividades()
    {
        $id = CurrentEvent::getId();

        $evento = Evento::query()
            ->with(["atividades.ministrantes", "local"])
            ->where("id_user", auth("web")->id())
            ->findOrFail($id);

        // $user = auth("web")->user();

        // if (!$user->can("show", $evento)) {
        //     CurrentEvent::forget();
        //     return redirect()->route("eventos.create");
        // }

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
    public function ministrantes()
{
    $ministrantes = Ministrante::query()
        ->where("id_user", auth("web")->id())
        ->get([
            "id",
            "nome",
            "email",
            "telefone",
            "cargo",
            "instituicao",
        ]);

    return inertia("Ministrantes/Index", [
        "ministrantes" => $ministrantes,
    ]);
}

    
}
