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

    public function inviteOrganizador(User $user, Evento $evento): bool
    {
        return $evento->organizadores()->whereKey($user->id)->exists();
    }
}
