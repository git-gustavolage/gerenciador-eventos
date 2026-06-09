<?php

namespace App\Exceptions;

use Throwable;

class LimitReachedException extends ApplicationException
{
    public function __construct(?string $message = null, array $details = [], ?Throwable $previus = null)
    {
        return parent::__construct($message ?? 'O limite de inscrições foi atingido.', $details, $previus);
    }
}
