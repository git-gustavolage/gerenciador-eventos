<?php

namespace App\Http\Controllers;

use App\Actions\Ministrante\DestroyMinistranteAction;
use App\Actions\Ministrante\UpdateMinistranteAction;
use App\Http\Requests\Ministrante\StoreMinistranteRequest;
use App\Http\Requests\Ministrante\UpdateMinistranteRequest;
use App\Models\Ministrante;
use App\Models\User;

class MinistranteController extends Controller
{
    public function index()
    {
        $ministrantes = Ministrante::query()
            ->where('id_user', auth('web')->id())
            ->orderBy('nome')
            ->get();

        return inertia('Ministrantes/Index', [
            'ministrantes' => $ministrantes,
        ]);
    }

    public function store(StoreMinistranteRequest $request)
    {
        $validated = $request->validated();
        $email = $validated['email'] ?? null;
        $userExistente = null;

        if ($email) {
            $userExistente = User::where('email', $email)->first();
        }

        if ($userExistente) {
            Ministrante::create([
                'nome' => $validated['nome'],
                'email' => $email,
                'telefone' => $validated['telefone'] ?? null,
                'cargo' => $validated['cargo'] ?? null,
                'instituicao' => $validated['instituicao'] ?? null,
                'id_user' => auth('web')->id(),
                'conta_id' => $userExistente->id,
            ]);

            return redirect()->back()->with('success', 'Usuário encontrado! O ministrante foi vinculado com sucesso.');

        } else {
            Ministrante::create([
                'nome' => $validated['nome'],
                'email' => $email,
                'telefone' => $validated['telefone'] ?? null,
                'cargo' => $validated['cargo'] ?? null,
                'instituicao' => $validated['instituicao'] ?? null,
                'id_user' => auth('web')->id(),
                'conta_id' => null,
            ]);

            return redirect()->back()->with('success', 'Ministrante cadastrado com sucesso!');
        }
    }

    public function minhasAtividades()
    {
        $ministrante = Ministrante::where('conta_id', auth('web')->id())
            ->firstOrFail();

        $atividades = $ministrante->atividades()
            ->with(['evento', 'ambiente'])
            ->whereHas('evento', function ($q) {
                $q->where('is_publicado', true)
                    ->where('is_cancelado', false);
            })
            ->get();

        return inertia('Ministrantes/MinhasAtividades', [
            'ministrante' => $ministrante,
            'atividades' => $atividades,
        ]);
    }

    public function update(int $id, UpdateMinistranteRequest $request, UpdateMinistranteAction $action)
    {
        $action->execute(auth('web')->id(), $id, $request->validated());

        return redirect()->back()->with('success', 'Ministrante atualizado com sucesso!');
    }

    public function destroy(int $id, DestroyMinistranteAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return redirect()->back()->with('success', 'Ministrante removido com sucesso!');
    }
}
