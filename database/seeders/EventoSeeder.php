<?php

namespace Database\Seeders;

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
                "titulo" => "I Simpósio de Tecnologia da Informação",
                "descricao" => "Um evento focado nas novas tendências do mercado de TI.",
                "formato" => "presencial",
                "categorias" => "tecnologia",
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
                "titulo" => "Congresso Regional de Saúde Pública",
                "descricao" => "Debates e discussões sobre o futuro da saúde na região.",
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
                "titulo" => "Encontro de Educadores da Amazônia",
                "descricao" => "Metodologias ativas e o futuro da educação.",
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
                "titulo" => "Jornada de Engenharia e Inovação",
                "descricao" => "Construção civil, inovações sustentáveis e cidades inteligentes.",
                "formato" => "presencial",
                "categorias" => "educação, engenharia",
                "id_local" => 2,
                "id_user" => 1,
                "data_inicio" => "2026-05-01 00:00:00",
                "data_fim" => "2026-05-30 23:59:59",
                "is_publicado" => true,
                "is_cancelado" => false,
                "is_encerrado" => true,
            ],
            [
                "id" => 5,
                "titulo" => "Semana Acadêmica de Desenvolvimento Web",
                "descricao" => "O principal evento do ano focado em frameworks web modernos, boas práticas de código e deploy.",
                "formato" => "presencial",
                "categorias" => '["Tecnologia"]',
                "id_local" => 1,
                "id_user" => 2,
                "data_inicio" => "2026-07-01 00:00:00",
                "data_fim" => "2026-07-31 23:59:59",
                "is_publicado" => false,
                "is_cancelado" => false,
                "is_encerrado" => false,
            ],
        ];

        DB::table("eventos")->insert($insert);
    }
}