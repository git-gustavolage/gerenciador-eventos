<?php

namespace App\Http\Middleware;

use App\Support\CurrentEvent;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AssertOrganizador
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->to(route('login'));
        }
        
        $evento = CurrentEvent::get();

        if (! $user->can('gerenciar', $evento)) {
            CurrentEvent::forget();

            return redirect()->route('home');
        }

        return $next($request);
    }
}
