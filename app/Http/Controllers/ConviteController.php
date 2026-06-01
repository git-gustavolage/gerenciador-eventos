<?php

namespace App\Http\Controllers;

use App\Actions\Convites\AcceptInviteAction;
use App\Actions\Convites\CancelInviteAction;
use App\Actions\Convites\InviteOrganizadorAction;
use App\Actions\Convites\ListPendingInvites;
use App\Http\Requests\Convite\InviteRequest;
use App\Http\Resources\Convite\ConviteResource;
use App\Models\Convite;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class ConviteController extends Controller
{
    public function view(string $token)
    {
        $convite = Convite::query()->with("evento:id,titulo")->where("token", $token)->firstOrFail();

        $authenticated = auth("web")->check();

        if (!$authenticated) {
            session(["pending_invite_token" => $token]);
        }

        return inertia("Convite/Index", [
            "convite" => [
                "token" => $convite->token,
                "evento" => $convite->evento->titulo,
                "email" => $convite->email,
                "expira_em" => $convite->expira_em,
                "is_expirado" => $convite->isExpirado(),
                "is_cancelado" => $convite->isCancelado(),
                "is_aceito" => $convite->isAceito(),
            ],
            "authenticated" => $authenticated,
        ]);
    }

    public function invite(InviteRequest $request, InviteOrganizadorAction $action)
    {
        $action->execute(auth("web")->id(), $request->input("id_evento"), $request->input("email"));

        return response()->json(["success" => true]);
    }

    public function accept(string $token, AcceptInviteAction $action)
    {
        $evento = $action->execute(auth("web")->id(), $token);

        CurrentEvent::set($evento->id);

        return response()->json(["success" => true]);
    }

    public function pending(Request $request, ListPendingInvites $action)
    {
        $pending = $action->execute($request->input("id_evento") ?? CurrentEvent::getId());

        return ConviteResource::collection($pending)->response();
    }

    public function cancel(int $id, CancelInviteAction $action)
    {
        $action->execute(auth("web")->id(), $id);

        return response()->noContent();
    }
}
