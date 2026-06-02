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
    Schema::table('ministrantes', function (Blueprint $table) {
        // Esta coluna guardará o ID do usuário real (o palestrante) se o e-mail bater
        $table->foreignId('conta_id')->nullable()->constrained('users')->nullOnDelete()->after('id_user');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ministrantes', function (Blueprint $table) {
            //
        });
    }
};
