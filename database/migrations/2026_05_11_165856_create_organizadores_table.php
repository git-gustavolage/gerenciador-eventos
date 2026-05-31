<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("organizadores", function (Blueprint $table) {
            $table->id();
            $table->string("perfil");
            $table->unsignedBigInteger("id_user");
            $table->unsignedBigInteger("id_evento");

            $table->foreign("id_user")->references("id")->on("users");
            $table->foreign("id_evento")->references("id")->on("eventos");

            $table->unique(['id_user', 'id_evento']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("organizacoes");
    }
};
