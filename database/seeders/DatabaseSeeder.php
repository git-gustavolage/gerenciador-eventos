<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $senhaPadrao = Hash::make('12345678');

        $users = [
            [
                'id' => 1,
                'nome' => 'ADMIN',
                'email' => 'admin@admin.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 1,
                'email_verified_at' => now(),
            ],
            [
                'id' => 2,
                'nome' => 'Barbara Campos Mercez',
                'email' => 'barbaracmercez@gmail.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 1,
                'email_verified_at' => now(),
            ],
            [
                'id' => 3,
                'nome' => 'Carlos Eduardo Pereira',
                'email' => 'carlos@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 4,
                'nome' => 'Ana Júlia Ribeiro',
                'email' => 'ana@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 5,
                'nome' => 'Lucas Ferreira Costa',
                'email' => 'lucas@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 6,
                'nome' => 'Mariana Oliveira Santos',
                'email' => 'mariana@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 7,
                'nome' => 'Pedro Henrique Alves',
                'email' => 'pedro@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 8,
                'nome' => 'Beatriz Souza Lima',
                'email' => 'beatriz@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 9,
                'nome' => 'Thiago Rodrigues Silva',
                'email' => 'thiago@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 10,
                'nome' => 'Fernanda Gomes Martins',
                'email' => 'fernanda@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 11,
                'nome' => 'Rafael Silva Carvalho',
                'email' => 'rafael@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 12,
                'nome' => 'Juliana Rocha Mendes',
                'email' => 'juliana@example.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
            [
                'id' => 13,
                'nome' => 'Kassandra de Oliveira Rodrigues',
                'email' => 'kassandra.olv.rodrigues@gmail.com',
                'password' => $senhaPadrao,
                'ativo' => 1,
                'admin' => 0,
                'email_verified_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);

        $this->call([
            LocalSeeder::class,
            AmbienteSeeder::class,
            EventoSeeder::class,
            OrganizadorSeed::class,
            AtividadeSeeder::class,
            InscricaoSeeder::class,
            CertificateTemplateSeeder::class,
        ]);
    }
}
