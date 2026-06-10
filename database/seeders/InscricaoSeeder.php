<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InscricaoSeeder extends Seeder
{
    public function run(): void
    {
        $inscricoesEvento = [];
        $inscricoesAtividade = [];
        $idInscricaoAtividade = 1; 
        $idEvento = 5; 

        for ($userId = 1; $userId <= 12; $userId++) {
            $inscricoesEvento[] = [
                'id_user' => $userId,
                'id_evento' => $idEvento,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
            
            $inscricoesAtividade[] = [
                'id' => $idInscricaoAtividade++,
                'id_user' => $userId,
                'id_atividade' => 9,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];

            $inscricoesAtividade[] = [
                'id' => $idInscricaoAtividade++,
                'id_user' => $userId,
                'id_atividade' => 10,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('inscricoes_evento')->insert($inscricoesEvento);
        DB::table('inscricoes_atividades')->insert($inscricoesAtividade);
    }
}