<?php

namespace App\Http\Middleware;

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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'current_evento_id' => CurrentEvent::getId(),
            ],
            'isMinistrante' => function () use ($request) {
                if (!$request->user()) return false;

                return \App\Models\Ministrante::where('conta_id', $request->user()->id)
                    ->whereHas('atividades', function ($q) {
                        $q->whereHas('evento', function ($q2) {
                            $q2->where('is_publicado', true)
                            ->where('is_cancelado', false);
                        });
                    })
                    ->exists();
            },
        ];
    }
}
