<?php

namespace App\Http\Controllers;

use App\Actions\Convites\AcceptInviteAction;
use App\Actions\Convites\InviteOrganizadorAction;
use App\Http\Requests\Convite\InviteRequest;
use App\Models\Convite;

class ConviteController extends Controller
{
    public function view(string $token)
    {
        $convite = Convite::query()->with("evento")->where("token", $token)->firstOrFail();

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
            ],
            "authenticated" => $authenticated,
        ]);
    }

    public function invite(InviteRequest $request, InviteOrganizadorAction $action)
    {
        $action->execute(auth("web")->id(), $request->input("id_evento"), $request->input("email"));

        return response()->json([
            "success" => true,
        ]);
    }

    public function accept(string $token, AcceptInviteAction $action)
    {
        $action->execute(auth("web")->id(), $token);

        return response()->json([
            "success" => true,
        ]);
    }
}
