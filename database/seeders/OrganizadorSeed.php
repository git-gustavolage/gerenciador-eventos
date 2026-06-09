<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganizadorSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $insert = [
            [
                'id' => 1,
                'id_user' => 1,
                'id_evento' => 1,
                'perfil' => 'gestor',
            ],
            [
                'id' => 2,
                'id_user' => 1,
                'id_evento' => 2,
                'perfil' => 'gestor',
            ],
            [
                'id' => 3,
                'id_user' => 1,
                'id_evento' => 3,
                'perfil' => 'gestor',
            ],
            [
                'id' => 4,
                'id_user' => 1,
                'id_evento' => 4,
                'perfil' => 'gestor',
            ],
        ];

        DB::table('organizadores')->insert($insert);
    }
}
