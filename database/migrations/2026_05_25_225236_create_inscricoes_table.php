<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscricoes_evento', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_user')->constrained('users')->cascadeOnDelete();
            $table->foreignId('id_evento')->constrained('eventos')->cascadeOnDelete();

            $table->string('status')->default('pendente');

            $table->boolean('compareceu')->nullable()->default(null);

            $table->unique(['id_user', 'id_evento']);

            $table->timestamps();
        });

        Schema::create('inscricoes_atividades', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_user')->constrained('users')->cascadeOnDelete();
            $table->foreignId('id_atividade')->constrained('atividades')->cascadeOnDelete();

            $table->string('status')->default('pendente');

            $table->boolean('compareceu')->nullable()->default(null);

            $table->unique(['id_user', 'id_atividade']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscricoes_atividades');
        Schema::dropIfExists('inscricoes_evento');
    }
};
