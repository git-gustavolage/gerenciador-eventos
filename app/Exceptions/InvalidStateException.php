<?php

namespace App\Exceptions;

class InvalidStateException extends ApplicationException
{
    public function __construct(?string $message = null, array $details = [])
    {
        return parent::__construct($message ?? "O recurso apresenta estado inválido.", $details);
    }
}
