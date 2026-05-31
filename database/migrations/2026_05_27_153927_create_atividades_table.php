<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('atividades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_evento')->constrained('eventos')->cascadeOnDelete();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->foreignId('id_ambiente')->constrained('ambientes')->restrictOnDelete();
            $table->dateTime('data_inicio');
            $table->dateTime('data_fim');
            $table->boolean('is_cancelada')->default(false);
            $table->unsignedInteger('limite_participantes')->nullable();
            $table->timestamps();
        });

        // Tabela pivot atividade <-> ministrante
        Schema::create('atividade_ministrante', function (Blueprint $table) {
            $table->foreignId('atividade_id')->constrained('atividades')->cascadeOnDelete();
            $table->foreignId('ministrante_id')->constrained('ministrantes')->cascadeOnDelete();
            $table->primary(['atividade_id', 'ministrante_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atividade_ministrante');
        Schema::dropIfExists('atividades');
    }
};