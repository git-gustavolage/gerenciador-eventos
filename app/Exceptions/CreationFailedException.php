<?php

namespace App\Exceptions;

class CreationFailedException extends ApplicationException
{
    public function __construct(?string $message = null, array $details = [])
    {
        return parent::__construct($message ?? 'Erro ao salvar o registro.', $details);
    }
}
