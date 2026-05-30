<?php

namespace App\Exceptions;

use Throwable;

class UserHasNoEventsException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Nenhum evento localizado. Cadastre um novo evento.", $details, $previus);
    }
}
