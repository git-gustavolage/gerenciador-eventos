<?php

namespace App\Http\Controllers;

use App\Actions\Atividade\AssociarMinistranteAtividadeAction;
use App\Actions\Atividade\CancelAtividadeAction;
use App\Actions\Atividade\DesassociarMinistranteAtividadeAction;
use App\Actions\Atividade\StoreAtividadeAction;
use App\Actions\Atividade\UpdateAtividadeAction;
use App\Http\Requests\Atividade\AddMinistranteRequest;
use App\Http\Requests\Atividade\StoreAtividadeRequest;
use App\Http\Requests\Atividade\UpdateAtividadeRequest;
use App\Http\Resources\AtividadeResource;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class AtividadeController extends Controller
{
    public function index()
    {
        $evento = CurrentEvent::get();
        $atividades = $evento
            ->atividades()
            ->with(['ambiente', 'ministrantes'])
            ->where('is_cancelada', false)
            ->orderBy('data_inicio')
            ->get();

        return response()->json([
            'data' => AtividadeResource::collection($atividades),
        ]);
    }

    public function store(StoreAtividadeRequest $request, StoreAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $request->validated());

        return response()->json(['success' => true], 201);
    }

    public function update(int $id, UpdateAtividadeRequest $request, UpdateAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id, $request->validated());

        return response()->json(['success' => true]);
    }

    public function cancel(int $id, CancelAtividadeAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return response()->noContent();
    }

    public function addMinistrante(AddMinistranteRequest $request, AssociarMinistranteAtividadeAction $action)
    {
        $user = auth('web')->user();
        $id_atividade = $request->validated('id_atividade');
        $id_ministrante = $request->validated('id_ministrante');

        $action->execute($user, $id_ministrante, $id_atividade);

        return response()->json(['success' => true], 201);
    }

    public function removeMinistrante(Request $request, DesassociarMinistranteAtividadeAction $action)
    {
        $user = auth('web')->user();
        $id_atividade = $request->input('id_atividade');
        $id_ministrante = $request->input('id_ministrante');

        $action->execute($user, $id_ministrante, $id_atividade);

        return response()->noContent();
    }
}
