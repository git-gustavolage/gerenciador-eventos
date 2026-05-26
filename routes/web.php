<?php

use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\OrganizacaoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get("/", [HomeController::class, "view"])->name("home");

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

    Route::group(["prefix" => "/manager", "as" => "manager.", "controller" => ManagerController::class], function () {
        Route::get("/", "view")->name("index");
        Route::get("/general", "general")->name("general");
        Route::get("/organization", [OrganizacaoController::class, "index"])->name("organization.index");
    });
});

require __DIR__ . "/auth.php";
