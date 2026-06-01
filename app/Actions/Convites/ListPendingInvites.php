<?php

namespace App\Actions\Convites;

use App\Models\Convite;

class ListPendingInvites
{
    public function execute(int $id_evento)
    {
        return Convite::query()
            ->where("id_evento", $id_evento)
            ->whereNull("aceito_em")
            ->whereNull("cancelado_em")
            ->orderBy("created_at")
            ->get()
            ->unique("email");
    }
}
