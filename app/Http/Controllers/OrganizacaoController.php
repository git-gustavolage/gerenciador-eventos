<?php

namespace App\Http\Controllers;

use App\Http\Resources\Ambiente\AmbienteResource;
use App\Http\Resources\AtividadeResource;
use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Ambiente;
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

    public function evento()
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

        return inertia("Organizacao/Evento/Index", [
            "evento" => EventoResource::make($evento),
            "locais" => LocalResource::collection($locais),
        ]);
    }

    public function organizadores()
    {
        $evento = CurrentEvent::get();

        return inertia("Organizacao/Organizadores/Index", [
            "evento" => $evento,
        ]);
    }

    public function ministrantes()
    {
        $ministrantes = Ministrante::query()
            ->where("id_user", auth("web")->id())
            ->get(["id", "nome", "email", "telefone", "cargo", "instituicao"]);

        return inertia("Ministrantes/Index", [
            "ministrantes" => $ministrantes,
        ]);
    }

    public function programacao()
    {
        $evento = CurrentEvent::get();
        $atividades = $evento
            ->atividades()
            ->with(["ambiente", "ministrantes"])
            ->where("is_cancelada", false)
            ->orderBy("data_inicio")
            ->get();
        $ambientes = Ambiente::query()->where("id_local", $evento->id_local)->get();
        $ministrantes = Ministrante::query()->get();

        return inertia("Organizacao/Programacao/Index", [
            "atividades" => AtividadeResource::collection($atividades),
            "ambientes" => AmbienteResource::collection($ambientes),
            "ministrantes" => $ministrantes,
        ]);
    }
}
