<?php

namespace App\Actions\Ministrante;

use App\Exceptions\ApplicationException;
use App\Models\Ministrante;
use Exception;

class DestroyMinistranteAction
{
    public function execute(int $id_user, int $id_ministrante)
    {
        $this->validate($id_user, $id_ministrante);

        try {
            Ministrante::delete($id_ministrante);
        } catch (Exception $e) {
            throw new ApplicationException('Erro ao deletar ministrante.', [
                'message' => $e->getMessage(),
                'id_user' => $id_user,
            ]);
        }
    }

    private function validate(int $id_user, int $id_ministrante)
    {
        //validar se user perternce a organizacao do evento que possui a atividade de onde o ministrante esta cadastrado
    }
}
