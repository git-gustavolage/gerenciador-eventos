<?php

namespace App\Policies;

use App\Models\Convite;
use App\Models\User;

class ConvitePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function cancel(User $user, Convite $convite): bool
    {
        return $convite->evento->organizadores()->where("id_user", $user->id)->exists();
    }
}
