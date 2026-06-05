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
        if ($atividade->is_cancelada) {
            return false;
        }

        return $user->id == $atividade->evento->id_user ||
            $atividade->evento->organizadores()->where("id_user", $user->id)->exists();
    }

    public function cancel(User $user, Atividade $atividade): bool
    {
        if ($atividade->is_cancelada) {
            return false;
        }

        return $user->id == $atividade->evento->id_user ||
            $atividade->evento->organizadores()->where("id_user", $user->id)->exists();
    }
}
