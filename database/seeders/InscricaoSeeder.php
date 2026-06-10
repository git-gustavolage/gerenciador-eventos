<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InscricaoSeeder extends Seeder
{
  public function run(): void
  {
    $inscricoes = [];
    $idInscricao = 1;

    for ($userId = 1; $userId <= 12; $userId++) {

      $inscricoes[] = [
        'id' => $idInscricao++,
        'id_user' => $userId,
        'id_atividade' => 9,
        'status' => 'pendente',
        'compareceu' => 1,
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
      ];

      $inscricoes[] = [
        'id' => $idInscricao++,
        'id_user' => $userId,
        'id_atividade' => 10,
        'status' => 'pendente',
        'compareceu' => 1,
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
      ];
    }

    DB::table('inscricoes_atividades')->insert($inscricoes);
  }
}