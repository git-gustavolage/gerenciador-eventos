<?php

namespace App\Support;

use App\Exceptions\UserHasNoEventsException;
use App\Models\Evento;

final readonly class CurrentEvent
{
    public static function get(): ?Evento
    {
        $id_evento = session("current_event_id");

        if ($evento = Evento::query()->find($id_evento)) {
            return $evento;
        }

        $evento = self::latestCreatedBy(auth("web")->id());

        if (!$evento) {
            throw new UserHasNoEventsException();
        }

        self::set($evento);

        return $evento;
    }

    public static function set(Evento $evento): void
    {
        session(["current_event_id" => $evento->id]);
    }

    private static function latestCreatedBy(int $id_user): ?Evento
    {
        return Evento::query()->where("id_user", $id_user)->latest()->first();
    }
}
