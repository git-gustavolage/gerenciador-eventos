<?php

namespace App\Http\Controllers;

use App\Models\Evento;

class ManagerController extends Controller
{
    public function view()
    {
        $event = $this->getCurrentEvent();

        if (!$event) {
            return redirect()->route("events.create");
        }

        return inertia("Manager/Index", [
            "event" => $event,
        ]);
    }       

    public function general()
    {
        $event = $this->getCurrentEvent();

        if (!$event) {
            return redirect()->route("events.create");
        }

        return inertia("Manager/General/Index", [
            "event" => $event,
        ]);
    }

    private function latestEventCreatedBy(int $id_user): ?Evento
    {
        return Evento::query()->where("id_user", $id_user)->latest()->first();
    }

    private function getCurrentEvent(): ?Evento
    {
        $event_id = session("current_event_id");
        if ($evento = Evento::query()->find($event_id)) {
            return $evento;
        }

        $evento = $this->latestEventCreatedBy(auth("web")->id());

        session(["current_event_id" => $evento->id]);

        return $evento;
    }
}
