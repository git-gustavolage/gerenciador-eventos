<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Evento;
use Illuminate\Http\Request;

class AmbienteController extends Controller
{
  public function store(Request $request, int $eventoId)
  {
    $validated = $request->validate([
      'nome' => ['required', 'string', 'max:255'],
      'capacidade' => ['nullable', 'integer', 'min:1'],
    ]);

    $evento = Evento::findOrFail($eventoId);

    $ambiente = Ambiente::create([
      'nome' => $validated['nome'],
      'capacidade' => $validated['capacidade'] ?? null,
      'id_local' => $evento->id_local,
    ]);

    return redirect()->back()->with([
      'success' => 'Ambiente cadastrado com sucesso!',
      'novo_ambiente_id' => $ambiente->id
    ]);
  }
}