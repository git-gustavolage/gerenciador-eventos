<?php

namespace App\Policies;

use App\Models\Atividade;
use App\Models\User;

class AtividadePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Atividade $atividade): bool
    {
        return $atividade->evento->organizadores()->where("id_user", $user->id)->exists();
    }
    
    public function destroy(User $user, Atividade $atividade): bool
    {
        return $atividade->evento->organizadores()->where("id_user", $user->id)->exists();
    }
}
