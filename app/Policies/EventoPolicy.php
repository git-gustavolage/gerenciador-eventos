<?php

namespace App\Policies;

use App\Models\Evento;
use App\Models\User;

class EventoPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function show(User $user, Evento $evento): bool
    {
        return $evento->organizadores()->where("id_user", $user->id)->exists();
    }
    
    public function update(User $user, Evento $evento): bool
    {
        return $evento->organizadores()->where("id_user", $user->id)->exists();
    }

    public function inviteOrganizador(User $user, Evento $evento): bool
    {
        return $evento->organizadores()->where("id_user", $user->id)->exists();
    }
    
    public function createAtividade(User $user, Evento $evento): bool
    {
        return $evento->organizadores()->where("id_user", $user->id)->exists();
    }
}
