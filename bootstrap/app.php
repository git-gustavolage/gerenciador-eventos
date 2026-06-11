<?php

use App\Exceptions\ApplicationException;
use App\Exceptions\UserHasNoEventsException;
use App\Http\Middleware\AssertAdmin;
use App\Http\Middleware\AssertOrganizador;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.'/../routes/web.php', commands: __DIR__.'/../routes/console.php', health: '/up')
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(
            append: [
                HandleInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
            ],
        );

        $middleware->alias([
            'admin' => AssertAdmin::class,
            'organizador' => AssertOrganizador::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (UserHasNoEventsException $e) {
            return redirect()->to(route('eventos.create'));
        });

        $exceptions->render(function (ApplicationException $e) {
            return response()->json($e->toArray(), $e->status());
        });
    })
    ->create();
