<?php

namespace App\Exceptions;

use Throwable;

class UnsupportedFileTypeException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Formato de arquivo não suportado.", $details, $previus);
    }
}
