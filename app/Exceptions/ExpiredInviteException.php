<?php

namespace App\Exceptions;

use Throwable;

class ExpiredInviteException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Este link expirou.", $details, $previus);
    }
}
