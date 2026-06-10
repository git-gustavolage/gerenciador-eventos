<?php

namespace App\Http\Middleware;

use App\Models\Ministrante;
use App\Models\Organizador;
use App\Support\CurrentEvent;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $is_organizador = $user ? Organizador::query()->where('id_user', $user?->id)->exists() ?? $user?->admin : false;
        $is_ministrante = $user ? Ministrante::query()->where('conta_id', $user?->id)
            ->whereHas('atividades', function ($q) {
                $q->whereHas('evento', function ($q2) {
                    $q2->where('is_publicado', true)
                        ->where('is_cancelado', false);
                });
            })
            ->exists() : false;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'current_evento_id' => CurrentEvent::getId(),
                'is_organizador' => $is_organizador,
            ],
            'isMinistrante' => $is_ministrante,
        ];
    }
}
