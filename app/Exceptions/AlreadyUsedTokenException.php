<?php

namespace App\Exceptions;

use Throwable;

class AlreadyUsedTokenException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Este link já foi usado.", $details, $previus);
    }
}
