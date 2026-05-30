<?php

namespace App\Exceptions;

use Throwable;

class CreationFailedException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Erro ao salvar o registro.", $details, $previus);
    }
}
