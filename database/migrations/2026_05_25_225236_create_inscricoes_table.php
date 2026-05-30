<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inscricoes_evento', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_evento');

            $table->string('status')->default('pendente');

            $table->boolean('compareceu')->nullable()->default(null);

            $table->foreign('id_user')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('id_evento')->references('id')->on('eventos')->cascadeOnDelete();

            $table->unique(['id_user', 'id_evento']);

            $table->timestamps();
        });

        Schema::create('inscricoes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_atividade');

            $table->string('status')->default('pendente');

            $table->boolean('compareceu')->nullable()->default(null);

            $table->foreign('id_user')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('id_atividade')->references('id')->on('atividades')->cascadeOnDelete();

            $table->unique(['id_user', 'id_atividade']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscricoes');
        Schema::dropIfExists('inscricoes_evento');
    }
};