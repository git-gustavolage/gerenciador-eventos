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

        return redirect()
    ->route('atividades.store')
    ->with('success', 'Atividade salva com sucesso!');
    }

    public function update(int $id, UpdateAtividadeRequest $request, UpdateAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id, $request->validated());

        return redirect()
    ->route('atividades.update')
    ->with('success', 'Atividade salva com sucesso!');
    }

    public function destroy(int $id, DestroyAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return response()->noContent();
    }
}
