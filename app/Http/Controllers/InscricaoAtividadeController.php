<?php

namespace App\Http\Controllers;

use App\Actions\Inscricao\DestoryInscricaoAtividadeAction;
use App\Actions\Inscricao\StoreInscricaoAtividadeAction;
use Illuminate\Http\Request;
use App\Models\Atividade;
use App\Mail\InscricaoAtividadeConfirmadaMail;
use Illuminate\Support\Facades\Mail;

class InscricaoAtividadeController extends Controller
{
    public function store(Request $request, StoreInscricaoAtividadeAction $action)
    {
       $user = auth('web')->user();
       $idAtividade = $request->input('id_atividade');

       $action->execute($user, $idAtividade);

       $atividade = Atividade::findOrFail($idAtividade);
       Mail::to($user->email)->send(new InscricaoAtividadeConfirmadaMail($atividade, $user));

       return response()->json(['success' => true]);
    }

    public function destroy(Request $request, DestoryInscricaoAtividadeAction $action)
    {
        $action->execute(auth('web')->user(), $request->input('id_inscricao'));

        return response()->noContent();
    }
}
