<?php

namespace App\Exceptions;

use Throwable;

class NotFoundException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Não foi possível localizar o registro informado.", $details, $previus);
    }
}
