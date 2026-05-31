<?php

namespace App\Actions\Organizadores;

use App\Models\Organizador;

class ListOrganizadoresAction
{
    public function execute(int $id_evento, array $filters = [])
    {
        $organizadores = Organizador::query()
            ->with(["user"])
            ->where("id_evento", $id_evento);

        return $organizadores->get();
    }
}
