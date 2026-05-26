<?php

use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrganizacaoController;
use App\Http\Controllers\OrganizadorController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get("/", [HomeController::class, "view"])->name('home');

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name("profile.edit");
    Route::patch("/profile", [ProfileController::class, "update"])->name("profile.update");
    Route::delete("/profile", [ProfileController::class, "destroy"])->name("profile.destroy");
});

Route::middleware("auth")->group(function () {
    Route::group(["prefix" => "/events", "as" => "events.", "controller" => EventoController::class], function () {
        Route::get("/create", "create")->name("create");
        Route::post("/store", "store")->name("store");
    });

    Route::group(["prefix" => "/manager", "as" => "manager."], function () {
        Route::get("/organization", [OrganizacaoController::class, "index"])->name("organization.index");

        // Dashboard do organizador — meus eventos
        Route::get("/my-events", [OrganizadorController::class, "dashboard"])->name("my-events");
    });
});


Route::middleware("auth")->group(function () {
    Route::group(["prefix" => "/events", "as" => "events.", "controller" => EventoController::class], function () {
        Route::get("/create", "create")->name("create");
        Route::post("/store", "store")->name("store");
 
        // ── Inscrições em Evento ──────────────────────────────────────────
        Route::prefix("/{evento}")->group(function () {
            Route::get(
                "/inscricoes",
                [InscricaoController::class, "indexEvento"]
            )->name("inscricoes.index");
 
            Route::post(
                "/inscricoes",
                [InscricaoController::class, "storeEvento"]
            )->name("inscricoes.store");
 
            Route::delete(
                "/inscricoes",
                [InscricaoController::class, "destroyEvento"]
            )->name("inscricoes.destroy");
 
            Route::patch(
                "/inscricoes/{inscricao}",
                [InscricaoController::class, "updateEvento"]
            )->name("inscricoes.update");
 
            // ── Inscrições em Atividade ───────────────────────────────────
            Route::prefix("/atividades/{atividade}")->group(function () {
                Route::get(
                    "/inscricoes",
                    [InscricaoController::class, "indexAtividade"]
                )->name("atividades.inscricoes.index");
 
                Route::post(
                    "/inscricoes",
                    [InscricaoController::class, "storeAtividade"]
                )->name("atividades.inscricoes.store");
 
                Route::delete(
                    "/inscricoes",
                    [InscricaoController::class, "destroyAtividade"]
                )->name("atividades.inscricoes.destroy");
 
                Route::patch(
                    "/inscricoes/{inscricao}",
                    [InscricaoController::class, "updateAtividade"]
                )->name("atividades.inscricoes.update");
            });
        });
    });
});

require __DIR__ . "/auth.php";