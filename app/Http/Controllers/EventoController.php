<?php

namespace App\Http\Controllers;

use App\Actions\Evento\CancelEventoAction;
use App\Actions\Evento\PublishEventoAction;
use App\Actions\Evento\StoreEventoAction;
use App\Actions\Evento\UpdateEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Enum\InscricaoStatusEnum;
use App\Http\Requests\Evento\StoreEventoRequest;
use App\Http\Requests\Evento\UpdateEventoRequest;
use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Evento;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;
use App\Models\Local;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;

class EventoController extends Controller
{
    public function view()
    {
        $eventos = Evento::with(['local'])
            ->withCount('atividades')
            ->where('is_publicado', true)
            ->where('is_cancelado', false)
            ->orderBy('data_inicio', 'asc')
            ->get();

        return inertia('Event/Publico/List', [
            'eventos' => $eventos,
        ]);
    }

    public function index()
    {
        $eventos = Evento::with(['local'])
            ->withCount('atividades')
            ->where('is_publicado', true)
            ->where('is_cancelado', false)
            ->orderBy('data_inicio', 'asc')
            ->get();

        return response()->json(['success' => true]);
    }

    public function create()
    {
        $locais = Local::query()->get();

        return inertia('Event/Create/Index', [
            'locais' => LocalResource::collection($locais),
        ]);
    }

    public function store(StoreEventoRequest $request, StoreEventoAction $action)
    {
        $input = new EventoData(
            $request->input('titulo'),
            $request->input('descricao'),
            EventoFormatoEnum::tryFrom(strtolower($request->input('formato'))),
            $request->array('categorias'),
            (int) $request->input('id_local'),
        );

        $evento = $action->execute(auth('web')->id(), $input);

        CurrentEvent::set($evento->id);

        return response()->json([
            'success' => true,
            'evento' => EventoResource::make($evento),
        ]);
    }

    public function update(UpdateEventoRequest $request, UpdateEventoAction $action)
    {
        $evento = CurrentEvent::get();

        $action->execute(auth('web')->id(), $evento->id, $request->validated());

        return response()->json(['success' => true]);
    }

    public function show(int $id)
    {
        $evento = Evento::with(['atividades.ministrantes', 'atividades.ambiente', 'local'])->findOrFail($id);

        if (! auth('web')->check()) {
            return inertia('Event/Publico/Index', [
                'evento' => $evento,
                'isOwner' => false,
                'inscritoNoEvento' => false,
                'atividadesInscritas' => [],
            ]);
        }

        $user = auth('web')->user();

        if (! $evento->is_publicado || $evento->is_cancelado) {
            if (! $user->can('show', $evento)) {
                abort(403, 'Este evento não está disponível publicamente.');
            }
        }

        $userId = auth('web')->id();

        return inertia('Event/Publico/Index', [
            'evento' => $evento,
            'isOwner' => true,

            'inscritoNoEvento' => $userId
                ? InscricaoEvento::query()->where('id_user', $userId)
                    ->where('id_evento', $id)
                    ->where('status', '!=', InscricaoStatusEnum::Cancelado)
                    ->exists()
                : false,

            'atividadesInscritas' => $userId
                ? InscricaoAtividade::query()->where('id_user', $userId)
                    ->whereIn('id_atividade', $evento->atividades->pluck('id'))
                    ->pluck('id_atividade')
                : [],
        ]);
    }

    public function cancel(Request $request, CancelEventoAction $action)
    {
        $action->execute(auth('web')->id(), $request->input('id_evento'));

        return response()->noContent();
    }
    
    public function publish(Request $request, PublishEventoAction $action)
    {
        $action->execute(auth('web')->id(), $request->input('id_evento'));

        return response()->noContent();
    }
}
