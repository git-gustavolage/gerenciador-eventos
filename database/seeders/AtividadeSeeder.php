<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AtividadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $atividades = [
            // Evento 1
            [
                "id_evento" => 1,
                "id_ambiente" => 1,
                "titulo" => "Palestra de Abertura",
                "descricao" => "Apresentação inicial do evento.",
                "data_inicio" => "2026-06-01 09:00:00",
                "data_fim" => "2026-06-01 10:30:00",
                "is_cancelada" => false,
                "limite_participantes" => 100,
            ],
            [
                "id_evento" => 1,
                "id_ambiente" => 2,
                "titulo" => "Workshop Prático",
                "descricao" => "Atividade prática para participantes.",
                "data_inicio" => "2026-06-01 14:00:00",
                "data_fim" => "2026-06-01 17:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 30,
            ],

            // Evento 2
            [
                "id_evento" => 2,
                "id_ambiente" => 1,
                "titulo" => "Mesa Redonda Online",
                "descricao" => "Discussão sobre temas da área da saúde.",
                "data_inicio" => "2026-06-05 10:00:00",
                "data_fim" => "2026-06-05 12:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 200,
            ],
            [
                "id_evento" => 2,
                "id_ambiente" => 2,
                "titulo" => "Sessão de Perguntas",
                "descricao" => "Interação com especialistas.",
                "data_inicio" => "2026-06-05 14:00:00",
                "data_fim" => "2026-06-05 15:30:00",
                "is_cancelada" => false,
                "limite_participantes" => 100,
            ],

            // Evento 3
            [
                "id_evento" => 3,
                "id_ambiente" => 3,
                "titulo" => "Aula Magna",
                "descricao" => "Apresentação de conteúdo educacional.",
                "data_inicio" => "2026-06-10 08:00:00",
                "data_fim" => "2026-06-10 10:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 120,
            ],
            [
                "id_evento" => 3,
                "id_ambiente" => 4,
                "titulo" => "Laboratório Prático",
                "descricao" => "Atividade prática em laboratório.",
                "data_inicio" => "2026-06-10 13:00:00",
                "data_fim" => "2026-06-10 16:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 25,
            ],

            // Evento 4
            [
                "id_evento" => 4,
                "id_ambiente" => 3,
                "titulo" => "Seminário de Encerramento",
                "descricao" => "Apresentação dos resultados do evento.",
                "data_inicio" => "2026-05-20 09:00:00",
                "data_fim" => "2026-05-20 11:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 80,
            ],
            [
                "id_evento" => 4,
                "id_ambiente" => 4,
                "titulo" => "Oficina Temática",
                "descricao" => "Oficina voltada para os participantes.",
                "data_inicio" => "2026-05-21 14:00:00",
                "data_fim" => "2026-05-21 17:00:00",
                "is_cancelada" => false,
                "limite_participantes" => 20,
            ],
        ];

        DB::table("atividades")->insert($atividades);
    }
}
