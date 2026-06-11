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
        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }

    public function update(User $user, Evento $evento): bool
    {
        if ($evento->is_cancelado) {
            return false;
        }

        if ($evento->is_encerrado) {
            return false;
        }

        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }

    public function inviteOrganizador(User $user, Evento $evento): bool
    {
        if ($evento->is_cancelado) {
            return false;
        }

        if ($evento->is_encerrado) {
            return false;
        }

        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }

    public function createAtividade(User $user, Evento $evento): bool
    {
        if ($evento->is_cancelado) {
            return false;
        }

        if ($evento->is_encerrado) {
            return false;
        }

        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }

    public function cancel(User $user, Evento $evento): bool
    {
        if ($evento->is_encerrado) {
            return false;
        }

        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }

    public function publish(User $user, Evento $evento): bool
    {
        if ($evento->is_cancelado) {
            return false;
        }

        if ($evento->is_encerrado) {
            return false;
        }

        return $user->id === $evento->id_user || $evento->organizadores()->where('id_user', $user->id)->exists();
    }
}
