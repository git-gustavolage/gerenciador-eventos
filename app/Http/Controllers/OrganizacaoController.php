<?php

namespace App\Http\Controllers;

use App\Http\Resources\Ambiente\AmbienteResource;
use App\Http\Resources\AtividadeResource;
use App\Http\Resources\Convite\ConviteResource;
use App\Http\Resources\Evento\EventoResource;
use App\Http\Resources\Local\LocalResource;
use App\Http\Resources\Organizador\OrganizadorResource;
use App\Models\Ambiente;
use App\Models\Atividade;
use App\Models\InscricaoAtividade;
use App\Models\InscricaoEvento;
use App\Models\Local;
use App\Models\Ministrante;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;
use App\Mail\InscricaoEventoConfirmadaMail;
use Illuminate\Support\Facades\Mail;

class OrganizacaoController extends Controller
{
    public function view(Request $request)
    {
        $evento = CurrentEvent::get($request->input('id'));

        return inertia('Organizacao/Index', [
            'evento' => $evento,
        ]);
    }

    public function evento()
    {
        $evento = CurrentEvent::get();
        $locais = Local::query()->get();

        if (! $evento) {
            return redirect()->route('eventos.create');
        }

        return inertia('Organizacao/Evento/Index', [
            'evento' => EventoResource::make($evento),
            'locais' => LocalResource::collection($locais),
        ]);
    }

    public function organizadores()
    {
        $evento = CurrentEvent::get();

        $organizadores = $evento->organizadores()->get();
        $convites = $evento->convites()
            ->whereNull('aceito_em')
            ->whereNull('cancelado_em')
            ->get();

        return inertia('Organizacao/Organizadores/Index', [
            'evento' => $evento,
            'organizadores' => OrganizadorResource::collection($organizadores),
            'convites' => ConviteResource::collection($convites),
        ]);
    }

    public function ministrantes()
    {
        $evento = CurrentEvent::get();

        //todo: adicionar id_evento
        $ministrantes = Ministrante::query()
            ->get(['id', 'nome', 'email', 'telefone', 'cargo', 'instituicao']);

        return inertia('Ministrantes/Index', [
            'evento' => $evento,
            'ministrantes' => $ministrantes,
        ]);
    }

    public function programacao()
    {
        $evento = CurrentEvent::get();
        $atividades = $evento
            ->atividades()
            ->with(['ambiente', 'ministrantes', 'inscricoes'])
            ->orderBy('data_inicio')
            ->get();

        $ambientes = Ambiente::query()->where('id_local', $evento->id_local)->get();
        $ministrantes = Ministrante::query()->get();

        return inertia('Organizacao/Programacao/Index', [
            'evento' => $evento,
            'atividades' => AtividadeResource::collection($atividades),
            'ambientes' => AmbienteResource::collection($ambientes),
            'ministrantes' => $ministrantes,
        ]);
    }

    public function inscricoes()
    {
        $evento = CurrentEvent::get();

        $inscricoes = InscricaoEvento::with('user')
            ->where('id_evento', $evento->id)
            ->paginate(20);

        $inscricoesAtividades = InscricaoAtividade::with(['user', 'atividade'])
            ->whereHas('atividade', function ($query) use ($evento) {
                $query->where('id_evento', $evento->id);
            })
            ->paginate(50);

        $atividades = Atividade::query()->where('id_evento', $evento->id)
            ->get(['id', 'titulo']);

        return inertia('Event/Organizacao/Inscricoes', [
            'evento' => $evento,
            'inscricoes' => $inscricoes,
            'inscricoesAtividades' => $inscricoesAtividades,
            'atividades' => $atividades,
        ]);
    }

    public function togglePresenca(InscricaoEvento $inscricaoEvento)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoEvento->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoEvento->update([
            'compareceu' => ! $inscricaoEvento->compareceu,
        ]);

        return back()->with('success', 'Status de presença atualizado!');
    }

    public function confirmarInscricao(InscricaoEvento $inscricaoEvento)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoEvento->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoEvento->update([
            'status' => 'confirmado',
        ]);
        $user = $inscricaoEvento->user;

        if ($user) {
            Mail::to($user->email)->send(new \App\Mail\InscricaoEventoConfirmadaMail($evento, $user));
        }

        return back()->with('success', 'Inscrição confirmada e participante notificado por e-mail!');
    }

    public function cancelarInscricao(InscricaoEvento $inscricaoEvento)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoEvento->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoEvento->update([
            'status' => 'cancelado',
        ]);

        return back()->with('success', 'Inscrição cancelada com sucesso!');
    }

    public function confirmarTodas()
    {
        $evento = CurrentEvent::get();

        InscricaoEvento::where('id_evento', $evento->id)
            ->where('status', 'pendente')
            ->update([
                'status' => 'confirmado',
            ]);

        return back()->with('success', 'Todas as inscrições pendentes foram confirmadas!');
    }

    public function inscricoesAtividade(Atividade $atividade)
    {
        $evento = CurrentEvent::get();

        if ($atividade->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricoes = InscricaoAtividade::with(['user', 'atividade'])
            ->where('id_atividade', $atividade->id)
            ->paginate(20);

        return inertia('Event/Organizacao/InscricoesAtividade', [
            'evento' => $evento,
            'atividade' => $atividade,
            'inscricoes' => $inscricoes,
        ]);
    }

    public function togglePresencaAtividade(InscricaoAtividade $inscricaoAtividade)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoAtividade->atividade->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoAtividade->update([
            'compareceu' => ! $inscricaoAtividade->compareceu,
        ]);

        return back()->with('success', 'Status de presença da atividade atualizado!');
    }

    public function confirmarInscricaoAtividade(InscricaoAtividade $inscricaoAtividade)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoAtividade->atividade->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoAtividade->update([
            'status' => 'confirmado',
        ]);

        return back()->with('success', 'Inscrição na atividade confirmada!');
    }

    public function cancelarInscricaoAtividade(InscricaoAtividade $inscricaoAtividade)
    {
        $evento = CurrentEvent::get();
        if ($inscricaoAtividade->atividade->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        $inscricaoAtividade->update([
            'status' => 'cancelado',
        ]);

        return back()->with('success', 'Inscrição na atividade cancelada!');
    }

    public function confirmarTodasAtividade(Atividade $atividade)
    {
        $evento = CurrentEvent::get();
        if ($atividade->id_evento !== $evento->id) {
            abort(403, 'Ação não permitida.');
        }

        InscricaoAtividade::where('id_atividade', $atividade->id)
            ->where('status', 'pendente')
            ->update([
                'status' => 'confirmado',
            ]);

        return back()->with('success', 'Todas as inscrições pendentes da atividade foram confirmadas!');
    }
}
