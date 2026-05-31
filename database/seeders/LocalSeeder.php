<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locais = [
            ["id" => 1, "nome" => "IFRO - Campus Porto Velho Calama"],
            ["id" => 2, "nome" => "IFRO - Campus Zona Norte"],
        ];

        DB::table("locais")->insert($locais);
    }
}
