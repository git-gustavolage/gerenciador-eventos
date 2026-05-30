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
        Schema::create("eventos", function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("id_user");
            $table->unsignedBigInteger("id_localidade")->nullable();

            $table->string("titulo");
            $table->longText("descricao")->nullable();
            $table->string("formato"); // enum: presencial, hibrido, remoto
            $table->longText("categorias");
            $table->string("endereco")->nullable();
            $table->string("banner_path")->nullable();

            $table->datetime("data_inicio")->nullable();
            $table->datetime("data_fim")->nullable();

            $table->datetime("data_inicio_inscricoes")->nullable();
            $table->datetime("data_fim_inscricoes")->nullable();

            $table->integer("limite_inscricoes")->nullable();

            $table->boolean("is_publicado")->default(false);
            $table->boolean("is_cancelado")->default(false);

            $table->foreign("id_user")->references("id")->on("users");
            $table->foreign("id_localidade")->references("id")->on("localidades");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("eventos");
    }
};
