<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $possuiEventos = \DB::table('eventos')
            ->where('id_user', $user->id)
            ->where(function ($query) {
                $query->where('is_cancelado', false)
                      ->orWhereExists(function ($subquery) {
                          $subquery->select(\DB::raw(1))
                                   ->from('inscricoes_evento')
                                   ->whereColumn('inscricoes_evento.id_evento', 'eventos.id');
                      })
                      ->orWhereExists(function ($subquery) {
                          $subquery->select(\DB::raw(1))
                                   ->from('inscricoes_atividades')
                                   ->join('atividades', 'atividades.id', '=', 'inscricoes_atividades.id_atividade')
                                   ->whereColumn('atividades.id_evento', 'eventos.id');
                      });
            })
            ->exists();

        if ($possuiEventos) {
            return back()->withErrors([
                'password' => 'Não é possível excluir a conta. Você é organizador de eventos que estão ativos ou que já possuem participantes inscritos.'
            ]);
        }

        Auth::logout();

        // Pra apagar coisa em que o usuário era participante
        \DB::table('inscricoes_atividades')->where('id_user', $user->id)->delete();
        \DB::table('inscricoes_evento')->where('id_user', $user->id)->delete();
        \DB::table('certificates')->where('id_user', $user->id)->delete();

        // Apaga os eventos vazios do usuário
        $eventosIds = \DB::table('eventos')->where('id_user', $user->id)->pluck('id');

        if ($eventosIds->isNotEmpty()) {
            $atividadesIds = \DB::table('atividades')->whereIn('id_evento', $eventosIds)->pluck('id');
            
            if ($atividadesIds->isNotEmpty()) {
                \DB::table('atividades_ministrantes')->whereIn('id_atividade', $atividadesIds)->delete();
                \DB::table('inscricoes_atividades')->whereIn('id_atividade', $atividadesIds)->delete();
                \DB::table('atividades')->whereIn('id', $atividadesIds)->delete();
            }

            \DB::table('certificate_templates')->whereIn('id_evento', $eventosIds)->delete();
            \DB::table('convites')->whereIn('id_evento', $eventosIds)->delete();
            \DB::table('organizadores')->whereIn('id_evento', $eventosIds)->delete();
            \DB::table('eventos')->whereIn('id', $eventosIds)->delete();
        }

        \DB::table('organizadores')->where('id_user', $user->id)->delete();
        \DB::table('ministrantes')->where('conta_id', $user->id)->delete();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
