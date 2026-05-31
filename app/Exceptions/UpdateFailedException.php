<?php

namespace App\Exceptions;

use Throwable;

class UpdateFailedException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Ocorreu um erro ao atualizar o registro.", $details, $previus);
    }
}
