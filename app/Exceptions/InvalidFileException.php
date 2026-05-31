<?php

namespace App\Exceptions;

use Throwable;

class InvalidFileException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Arquivo inválido.", $details, $previus);
    }
}
