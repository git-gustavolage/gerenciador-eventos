<?php

namespace App\Actions\Evento;

use App\Models\Evento;

class UpdateEventoAction
{
    public function execute(int $evento_id, array $input)
    {
        $evento = Evento::query()->findOrFail($evento_id);

        $evento->update($input);

        return $evento->fresh();
    }
}
