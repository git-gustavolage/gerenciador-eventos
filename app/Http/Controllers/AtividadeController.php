<?php

namespace App\Http\Controllers;

use App\Actions\Atividade\DestroyAtividadeAction;
use App\Actions\Atividade\StoreAtividadeAction;
use App\Actions\Atividade\UpdateAtividadeAction;
use App\Http\Requests\Atividade\StoreAtividadeRequest;
use App\Http\Requests\Atividade\UpdateAtividadeRequest;
use App\Models\Ambiente;
use App\Models\Evento;
use App\Models\Ministrante;
use App\Support\CurrentEvent;
use Exception;

class AtividadeController extends Controller
{
    public function store(StoreAtividadeRequest $request, StoreAtividadeAction $action)
    {
        try {
            $action->execute(auth("web")->id(), $request->validated());

            return redirect()->back()->with("success", "Atividade criada com sucesso!");
        } catch (Exception $e) {
                    \Log::error($e->getMessage()); // <-- adiciona

            return redirect()
                ->back()
                ->withErrors(["error" => "Erro ao salvar: " . $e->getMessage()]);
        }
    }

    public function update(int $id, UpdateAtividadeRequest $request, UpdateAtividadeAction $action)
    {
        try {
            $action->execute(auth("web")->id(), $id, $request->validated());
            return redirect()->back()->with("success", "Atividade atualizada com sucesso!");
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->withErrors(["error" => "Erro ao atualizar: " . $e->getMessage()]);
        }
    }

    public function destroy(int $id, DestroyAtividadeAction $action)
    {
        try {
            $action->execute(auth("web")->id(), $id);
            return redirect()->back()->with("success", "Atividade excluída com sucesso!");
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->withErrors(["error" => "Erro ao excluir: " . $e->getMessage()]);
        }
    }
}
