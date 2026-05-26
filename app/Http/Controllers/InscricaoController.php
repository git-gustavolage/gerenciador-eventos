<?php

namespace App\Http\Controllers;

use App\Enum\InscricaoStatusEnum;
use App\Models\Atividade;
use App\Models\Evento;
use App\Models\Inscricao;
use App\Models\InscricaoEvento;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InscricaoController extends Controller
{

    public function indexEvento(Evento $evento)
    {
        $inscricoes = InscricaoEvento::where('id_evento', $evento->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($i) => [
                'id'         => $i->id,
                'user'       => ['id' => $i->user->id, 'nome' => $i->user->nome, 'email' => $i->user->email],
                'status'     => $i->status,
                'compareceu' => $i->compareceu,
                'criado_em'  => $i->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json($inscricoes);
    }


    public function storeEvento(Evento $evento)
    {
        $userId = auth('web')->id();

        abort_if(
            $evento->data_fim_inscricoes && $evento->data_fim_inscricoes->isPast(),
            422,
            'As inscrições para este evento estão encerradas.'
        );

        if ($evento->limite_inscricoes) {
            $total = InscricaoEvento::where('id_evento', $evento->id)
                ->whereNot('status', InscricaoStatusEnum::Cancelado)
                ->count();

            abort_if($total >= $evento->limite_inscricoes, 422, 'Limite de inscrições atingido.');
        }

        $inscricao = InscricaoEvento::firstOrCreate(
            ['id_user' => $userId, 'id_evento' => $evento->id],
            ['status' => InscricaoStatusEnum::Pendente]
        );

        abort_if($inscricao->wasRecentlyCreated === false, 422, 'Você já está inscrito neste evento.');

        return response()->json(['success' => true, 'id' => $inscricao->id], 201);
    }


    public function destroyEvento(Evento $evento)
    {
        $userId = auth('web')->id();

        $inscricao = InscricaoEvento::where('id_user', $userId)
            ->where('id_evento', $evento->id)
            ->firstOrFail();

        $inscricao->update(['status' => InscricaoStatusEnum::Cancelado]);

        return response()->noContent();
    }


    public function updateEvento(Request $request, Evento $evento, InscricaoEvento $inscricao)
    {
        $data = $request->validate([
            'status'     => ['sometimes', Rule::enum(InscricaoStatusEnum::class)],
            'compareceu' => ['sometimes', 'nullable', 'boolean'],
        ]);

        $inscricao->update($data);

        return response()->json(['success' => true]);
    }


    public function indexAtividade(Evento $evento, Atividade $atividade)
    {
        $inscricoes = Inscricao::where('id_atividade', $atividade->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($i) => [
                'id'         => $i->id,
                'user'       => ['id' => $i->user->id, 'nome' => $i->user->nome, 'email' => $i->user->email],
                'status'     => $i->status,
                'compareceu' => $i->compareceu,
                'criado_em'  => $i->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json($inscricoes);
    }


    public function storeAtividade(Evento $evento, Atividade $atividade)
    {
        $userId = auth('web')->id();

        abort_if($atividade->is_cancelada, 422, 'Esta atividade foi cancelada.');

        if ($atividade->limite_participantes) {
            $total = Inscricao::where('id_atividade', $atividade->id)
                ->whereNot('status', InscricaoStatusEnum::Cancelado)
                ->count();

            abort_if($total >= $atividade->limite_participantes, 422, 'Limite de participantes atingido.');
        }

        $inscricao = Inscricao::firstOrCreate(
            ['id_user' => $userId, 'id_atividade' => $atividade->id],
            ['status' => InscricaoStatusEnum::Pendente]
        );

        abort_if($inscricao->wasRecentlyCreated === false, 422, 'Você já está inscrito nesta atividade.');

        return response()->json(['success' => true, 'id' => $inscricao->id], 201);
    }


    public function destroyAtividade(Evento $evento, Atividade $atividade)
    {
        $userId = auth('web')->id();

        $inscricao = Inscricao::where('id_user', $userId)
            ->where('id_atividade', $atividade->id)
            ->firstOrFail();

        $inscricao->update(['status' => InscricaoStatusEnum::Cancelado]);

        return response()->noContent();
    }


    public function updateAtividade(Request $request, Evento $evento, Atividade $atividade, Inscricao $inscricao)
    {
        $data = $request->validate([
            'status'     => ['sometimes', Rule::enum(InscricaoStatusEnum::class)],
            'compareceu' => ['sometimes', 'nullable', 'boolean'],
        ]);

        $inscricao->update($data);

        return response()->json(['success' => true]);
    }
}