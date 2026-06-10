<?php

namespace App\Http\Controllers;

use App\Actions\Evento\StoreEventoAction;
use App\Actions\Evento\UpdateEventoAction;
use App\DataTransferObjects\EventoData;
use App\Enum\EventoFormatoEnum;
use App\Http\Requests\Evento\StoreEventoRequest;
use App\Http\Requests\Evento\UpdateEventoRequest;
use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Models\Evento;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;
use App\Models\Local;
use App\Support\CurrentEvent;
use App\Models\User;
use App\Mail\EventoCanceladoMail;

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

        $estavaCancelado = $evento->is_cancelado;
        $eventoAtualizado = $action->execute(auth('web')->id(), $evento->id, $request->validated());

        // Pra notificar que foi cancelado
        if ($request->input('is_cancelado') == true && !$estavaCancelado) {

            $userIdsEvento = \DB::table('inscricoes_evento')
                ->where('id_evento', $evento->id)
                ->pluck('id_user');

            $userIdsAtividades = \DB::table('inscricoes_atividades')
                ->join('atividades', 'atividades.id', '=', 'inscricoes_atividades.id_atividade')
                ->where('atividades.id_evento', $evento->id)
                ->pluck('id_user');

            $userIdsUnicos = $userIdsEvento->merge($userIdsAtividades)->unique();

            if ($userIdsUnicos->isNotEmpty()) {
                $inscritos = User::whereIn('id', $userIdsUnicos)->get();
                foreach ($inscritos as $inscrito) {
                    \Illuminate\Support\Facades\Mail::to($inscrito->email)->send(new EventoCanceladoMail($eventoAtualizado, $inscrito));
                }
            }

            // Pra apagar as inscrições
            \DB::table('inscricoes_evento')
                ->where('id_evento', $evento->id)
                ->delete();

            $atividadesDoEvento = \DB::table('atividades')->where('id_evento', $evento->id)->pluck('id');
            if ($atividadesDoEvento->isNotEmpty()) {
                \DB::table('inscricoes_atividades')
                    ->whereIn('id_atividade', $atividadesDoEvento)
                    ->delete();
            }
            
            return back()->with('success', 'Evento cancelado! Inscrições foram desfeitas e participantes notificados.');
        }

        return back()->with('success', 'Status do evento atualizado!');
    }

    public function show(int $id)
    {
        $user = auth('web')->user();
        $evento = Evento::with(['atividades.ministrantes', 'atividades.ambiente', 'local'])->findOrFail($id);

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
                ? InscricaoEvento::where('id_user', $userId)
                    ->where('id_evento', $id)
                    ->exists()
                : false,

            'atividadesInscritas' => $userId
                ? InscricaoAtividade::where('id_user', $userId)
                    ->whereIn('id_atividade', $evento->atividades->pluck('id'))
                    ->pluck('id_atividade')
                : [],
        ]);
    }
}
