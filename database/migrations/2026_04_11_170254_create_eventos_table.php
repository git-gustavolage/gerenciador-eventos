<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organizacao_id');
            $table->unsignedBigInteger('localidade_id');
            $table->unsignedBigInteger('user_id');

            $table->string('titulo');
            $table->longText('descricao');
            $table->string('banner_path');
            $table->string('formato'); // enum: presencial, hibrido, online

            $table->datetime('data_inicio');
            $table->datetime('data_fim');

            $table->boolean('is_publicado')->default(false);
            $table->boolean('is_cancelado')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
