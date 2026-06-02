<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('atividade_ministrante', function (Blueprint $table) {
            // pendente = aguardando resposta | confirmado | recusado
            $table->string('status')->default('pendente')->after('ministrante_id');
        });
    }

    public function down(): void
    {
        Schema::table('atividade_ministrante', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};