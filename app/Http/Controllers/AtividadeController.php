<?php

namespace App\Http\Controllers;

use App\Actions\Atividade\DestroyAtividadeAction;
use App\Actions\Atividade\StoreAtividadeAction;
use App\Actions\Atividade\UpdateAtividadeAction;
use App\Http\Requests\Atividade\StoreAtividadeRequest;
use App\Http\Requests\Atividade\UpdateAtividadeRequest;

class AtividadeController extends Controller
{
    public function store(StoreAtividadeRequest $request, StoreAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $request->validated());

        return redirect()->back()->with('success', 'Atividade criada com sucesso!');
    }

    public function update(int $id, UpdateAtividadeRequest $request, UpdateAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id, $request->validated());

        return redirect()->back()->with('success', 'Atividade atualizada com sucesso!');
    }

    public function destroy(int $id, DestroyAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return redirect()->back()->with('success', 'Atividade excluída com sucesso!');
    }
}