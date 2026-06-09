<?php

namespace App\Http\Controllers;

use App\Actions\Inscricao\DestoryInscricaoAtividadeAction;
use App\Actions\Inscricao\StoreInscricaoAtividadeAction;
use Illuminate\Http\Request;

class InscricaoAtividadeController extends Controller
{
    public function store(Request $request, StoreInscricaoAtividadeAction $action)
    {
        $action->execute(auth('web')->user(), $request->input('id_atividade'));

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, DestoryInscricaoAtividadeAction $action)
    {
        $action->execute(auth('web')->user(), $request->input('id_inscricao'));

        return response()->noContent();
    }
}
