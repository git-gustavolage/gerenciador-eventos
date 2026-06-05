<?php

use App\Http\Controllers\AtividadeController;
use App\Http\Controllers\ConviteController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\OrganizadoresController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizacaoController;
use App\Support\S3Manager;
use App\Http\Controllers\MinistranteController;
use Illuminate\Support\Facades\Route;

Route::get("/", [HomeController::class, "view"])->name("home");

Route::get("/eventos", [EventoController::class, "index"])->name("eventos.publico.index");

Route::get("/eventos/{id}", [EventoController::class, "show"])
    ->name("eventos.publico.show")
    ->whereNumber("id");
    
Route::get("/midia/{path}", fn(string $path) => S3Manager::get($path, "imagem"))->name("midia")->where("path", ".*");


Route::get("/api/eventos/publicos", function () {
    return \App\Models\Evento::with(['local'])
        ->where('is_publicado', true)
        ->where('is_cancelado', false)
        ->orderBy('data_inicio', 'asc')
        ->get();
})->name("api.eventos.publicos");

Route::middleware("auth")->group(function () {
    Route::get("/dashboard", [DashboardController::class, "view"])->name("dashboard");

    Route::group(["prefix" => "/eventos", "as" => "eventos.", "controller" => EventoController::class], function () {
        Route::get("/create", "create")->name("create");
        Route::post("/store", "store")->name("store");
        Route::put("/update", "update")->name("update");

        Route::group(["prefix" => "/organizacao", "as" => "organizacao."], function () {
            Route::get("/", [OrganizacaoController::class, "view"])->name("view");
            Route::get("/edit", [OrganizacaoController::class, "edit"])->name("edit");
            Route::get("/organizadores", [OrganizacaoController::class, "organizadores"])->name("organizadores");
            Route::get("/atividades", [OrganizacaoController::class, "atividades"])->name("atividades");
            Route::get("/ministrantes", [OrganizacaoController::class, "ministrantes"])->name("ministrantes");

           Route::get("/inscricoes", [OrganizacaoController::class, "inscricoes"])->name("inscricoes");
            Route::post("/inscricoes/confirmar-todas", [OrganizacaoController::class, "confirmarTodas"])->name("confirmar-todas");
            Route::put("/inscricoes/{inscricaoEvento}/confirmar", [OrganizacaoController::class, "confirmarInscricao"])->name("confirmar-inscricao");
            Route::put("/inscricoes/{inscricaoEvento}/cancelar", [OrganizacaoController::class, "cancelarInscricao"])->name("cancelar-inscricao");
            Route::put("/inscricoes/{inscricaoEvento}/toggle-presenca", [OrganizacaoController::class, "togglePresenca"])->name("toggle-presenca");
       
             Route::get("/atividades/{atividade}/inscricoes", [OrganizacaoController::class, "inscricoesAtividade"])->name("atividades.inscricoes");
             Route::post("/atividades/{atividade}/inscricoes/confirmar-todas", [OrganizacaoController::class, "confirmarTodasAtividade"])->name("atividades.confirmar-todas");
             Route::put("/atividades/inscricoes/{inscricaoAtividade}/confirmar", [OrganizacaoController::class, "confirmarInscricaoAtividade"])->name("atividades.confirmar-inscricao");
             Route::put("/atividades/inscricoes/{inscricaoAtividade}/cancelar", [OrganizacaoController::class, "cancelarInscricaoAtividade"])->name("atividades.cancelar-inscricao");
             Route::put("/atividades/inscricoes/{inscricaoAtividade}/toggle-presenca", [OrganizacaoController::class, "togglePresencaAtividade"])->name("atividades.toggle-presenca");
            });
    });

    Route::group(["prefix" => "/ministrantes", "as" => "ministrantes.", "controller" => MinistranteController::class], function () {
    Route::get("/", "index")->name("index");
    Route::post("/", "store")->name("store");
    Route::put("/{id}", "update")->name("update");
    Route::delete("/{id}", "destroy")->name("destroy");
});

Route::prefix('eventos/{evento}')->name('eventos.')->group(function () {
 
       Route::get('inscricao/dados', [InscricaoController::class, 'dadosInscricao'])
        ->name('inscricao.dados')
        ->middleware('auth:web');
 
     Route::post('inscricao', [InscricaoController::class, 'store'])
        ->name('inscricao.store')
        ->middleware('auth:web');
});

    // Route::group(["prefix" => "/inscricoes", "as" => "inscricoes."], function () {
    //     Route::get("/", [InscricaoController::class, "indexEvento"])->name("inscricoes.index");
    //     Route::post("/", [InscricaoController::class, "storeEvento"])->name("inscricoes.store");
    //     Route::delete("/", [InscricaoController::class, "destroyEvento"])->name("inscricoes.destroy");
    //     Route::patch("/{inscricao}", [InscricaoController::class, "updateEvento"])->name("inscricoes.update");
    // });

    // Route::group(["prefix" => "/atividades/{atividade}", "as" => "atividades."], function () {
    //     Route::get("/inscricoes", [InscricaoController::class, "indexAtividade"])->name("atividades.inscricoes.index");
    //     Route::post("/inscricoes", [InscricaoController::class, "storeAtividade"])->name("atividades.inscricoes.store");
    //     Route::delete("/inscricoes", [InscricaoController::class, "destroyAtividade"])->name("atividades.inscricoes.destroy");
    //     Route::patch("/inscricoes/{inscricao}", [InscricaoController::class, "updateAtividade"])->name(
    //         "atividades.inscricoes.update",
    //     );
    // });
    //
    Route::post("/atividades", [AtividadeController::class, "store"])->name("atividades.store");
     Route::put("/atividades/{id}", [AtividadeController::class, "update"])->name("atividades.update");
     Route::delete("/atividades/{id}", [AtividadeController::class, "destroy"])->name("atividades.destroy");

    Route::group(["prefix" => "/organizadores", "as" => "organizadores."], function () {
        Route::get("/", [OrganizadoresController::class, "view"])->name("view");
        Route::get("/index", [OrganizadoresController::class, "index"])->name("index");
        Route::delete("/destoy/{id}", [OrganizadoresController::class, "destroy"])->name("destroy");
    });

    Route::group(["prefix" => "/ambientes", "as" => "ambientes.", "controller" => AmbienteController::class], function () {
        Route::post("/store", "store")->name("store");
    });

    Route::group(["prefix" => "/convites", "as" => "convites.", "controller" => ConviteController::class], function () {
        Route::get("/handle/{token}", "view")->name("view")->withoutMiddleware("auth");
        Route::get("/pending", "pending")->name("pending");
        Route::post("/accept/{token}", "accept")->name("accept");
        Route::post("/invite", "invite")->name("invite");
        Route::delete("/cancel/{id}", "cancel")->name("cancel");
    });

    Route::group(["prefix" => "/profile", "as" => "profile.", "controller" => ProfileController::class], function () {
        Route::get("/profile", "edit")->name("edit");
        Route::patch("/profile", "update")->name("update");
        Route::delete("/profile", "destroy")->name("destroy");
    });

    
});

require __DIR__ . "/auth.php";
