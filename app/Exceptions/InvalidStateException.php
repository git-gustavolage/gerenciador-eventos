<?php

namespace App\Exceptions;

use Throwable;

class InvalidStateException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "O recurso apresenta estado inválido.", $details, $previus);
    }
}
