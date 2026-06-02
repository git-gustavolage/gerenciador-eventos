<?php

namespace App\Actions\Ministrante;

use App\Models\Ministrante;
use App\Models\User;

class StoreMinistranteAction
{
    public function execute(int $id_user, array $data): void
    {
        $contaVinculada = null;
        
        if (!empty($data['email'])) {
            $contaVinculada = User::where('email', $data['email'])->first();
        }

        Ministrante::create([
            'id_user'     => $id_user, 
            'conta_id'    => $contaVinculada ? $contaVinculada->id : null, 
            'nome'        => $data['nome'],
            'email'       => $data['email'] ?? null,
            'telefone'    => $data['telefone'] ?? null,
            'cargo'       => $data['cargo'] ?? null,
            'instituicao' => $data['instituicao'] ?? null,
        ]);
    }
}