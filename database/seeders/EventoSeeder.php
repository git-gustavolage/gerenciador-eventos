<?php

namespace Database\Seeders;

use App\Models\Local;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $insert = [
            [
                "id" => 1,
                "titulo" => "Evento 01",
                "descricao" => "Descrição 01",
                "formato" => "presencial",
                "categorias" => "outro",
                "id_local" => 1,
                "id_user" => 1,
                "data_inicio" => "2026-06-01 00:00:00",
                "data_fim" => "2026-06-30 23:59:59",
                "is_publicado" => true,
                "is_cancelado" => false,
                "is_encerrado" => false,
            ],
            [
                "id" => 2,
                "titulo" => "Evento 02",
                "descricao" => "Descrição 02",
                "formato" => "remoto",
                "categorias" => "saúde",
                "id_local" => 1,
                "id_user" => 1,
                "data_inicio" => "2026-06-01 00:00:00",
                "data_fim" => "2026-06-30 23:59:59",
                "is_publicado" => false,
                "is_cancelado" => false,
                "is_encerrado" => false,
            ],
            [
                "id" => 3,
                "titulo" => "Evento 03",
                "descricao" => "Descrição 03",
                "formato" => "hibrido",
                "categorias" => "educação",
                "id_local" => 2,
                "id_user" => 1,
                "data_inicio" => "2026-06-01 00:00:00",
                "data_fim" => "2026-06-30 23:59:59",
                "is_publicado" => false,
                "is_cancelado" => false,
                "is_encerrado" => false,
            ],
            [
                "id" => 4,
                "titulo" => "Evento 04",
                "descricao" => "Descrição 04",
                "formato" => "presencial",
                "categorias" => "educação, saúde",
                "id_local" => 2,
                "id_user" => 1,
                "data_inicio" => "2026-05-01 00:00:00",
                "data_fim" => "2026-05-30 23:59:59",
                "is_publicado" => true,
                "is_cancelado" => false,
                "is_encerrado" => true,
            ],
        ];

        DB::table("eventos")->insert($insert);
    }
}
