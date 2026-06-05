<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AmbienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ambientes = [
            [
                "id" => 1,
                "id_local" => 1,
                "nome" => "Auditório Principal",
            ],
            [
                "id" => 2,
                "id_local" => 1,
                "nome" => "Sala de Treinamento",
            ],
            [
                "id" => 3,
                "id_local" => 2,
                "nome" => "Auditório Central",
            ],
            [
                "id" => 4,
                "id_local" => 2,
                "nome" => "Laboratório de Informática",
            ],
        ];

        DB::table("ambientes")->insert($ambientes);
    }
}
