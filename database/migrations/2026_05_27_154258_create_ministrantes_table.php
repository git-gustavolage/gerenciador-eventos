<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ministrantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->cascadeOnDelete();
            $table->string('nome');
            $table->string('email')->unique()->nullable();
            $table->string('telefone')->unique()->nullable();
            $table->text('bio')->nullable();
            $table->string('foto_path')->nullable();
            $table->timestamps();
            $table->foreignId('conta_id')->nullable()->constrained('users')->nullOnDelete()->after('id_user');
            $table->string('cargo')->nullable();
            $table->string('instituicao')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ministrantes');
    }
};
