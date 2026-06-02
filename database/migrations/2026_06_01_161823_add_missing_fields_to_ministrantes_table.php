<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ministrantes', function (Blueprint $table) {
           
            if (!Schema::hasColumn('ministrantes', 'telefone')) {
                $table->string('telefone')->nullable()->after('email');
            }

            if (!Schema::hasColumn('ministrantes', 'cargo')) {
                $table->string('cargo')->nullable();
            }

            if (!Schema::hasColumn('ministrantes', 'instituicao')) {
                $table->string('instituicao')->nullable();
            }
            
            if (!Schema::hasColumn('ministrantes', 'conta_id')) {
                $table->foreignId('conta_id')->nullable()->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('ministrantes', function (Blueprint $table) {
            // Remove as colunas apenas se elas existirem de fato
            if (Schema::hasColumn('ministrantes', 'conta_id')) {
                $table->dropForeign(['conta_id']);
                $table->dropColumn('conta_id');
            }
            
            $columnsToDrop = array_filter(['cargo', 'instituicao'], function ($column) {
                return Schema::hasColumn('ministrantes', $column);
            });

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};