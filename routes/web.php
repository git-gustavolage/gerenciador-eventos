<?php

use App\Http\Controllers\AtividadeController; 
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\OrganizadorController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get("/", [HomeController::class, "view"])->name("home");

Route::middleware("auth")->group(function () {

    Route::get("/profile", [ProfileController::class, "edit"])->name("profile.edit");
    Route::patch("/profile", [ProfileController::class, "update"])->name("profile.update");
    Route::delete("/profile", [ProfileController::class, "destroy"])->name("profile.destroy");

    Route::group(["prefix" => "/organizador", "as" => "organizador.", "controller" => OrganizadorController::class], function () {
        Route::get("/", "view")->name("index");

        Route::group(["prefix" => "/evento", "as" => "evento."], function () {
            Route::get("/general", "general")->name("general");
        });
    });

    Route::group(["prefix" => "/eventos", "as" => "eventos.", "controller" => EventoController::class], function () {
        Route::get("/create", "create")->name("create");
        Route::post("/store", "store")->name("store");
        Route::put("/update", "update")->name("update");

        Route::prefix("/{evento}")->group(function () {
            Route::get('/edit', 'edit')->name('edit');
            
            Route::get("/inscricoes", [InscricaoController::class, "indexEvento"])->name("inscricoes.index");
            Route::post("/inscricoes", [InscricaoController::class, "storeEvento"])->name("inscricoes.store");
            Route::delete("/inscricoes", [InscricaoController::class, "destroyEvento"])->name("inscricoes.destroy");
            Route::patch("/inscricoes/{inscricao}", [InscricaoController::class, "updateEvento"])->name("inscricoes.update");

            Route::prefix("/atividades/{atividade}")->group(function () {
                Route::get("/inscricoes", [InscricaoController::class, "indexAtividade"])->name("atividades.inscricoes.index");
                Route::post("/inscricoes", [InscricaoController::class, "storeAtividade"])->name("atividades.inscricoes.store");
                Route::delete("/inscricoes", [InscricaoController::class, "destroyAtividade"])->name("atividades.inscricoes.destroy");
                Route::patch("/inscricoes/{inscricao}", [InscricaoController::class, "updateAtividade"])->name("atividades.inscricoes.update");
            });
        });
    });

    Route::post("/atividades", [AtividadeController::class, "store"])->name("atividades.store");
    Route::put("/atividades/{id}", [AtividadeController::class, "update"])->name("atividades.update");
    Route::delete("/atividades/{id}", [AtividadeController::class, "destroy"])->name("atividades.destroy");
});

require __DIR__ . "/auth.php";
