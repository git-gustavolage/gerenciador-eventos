<?php

namespace App\Exceptions;

use Throwable;

class ScheduleConflictException extends ApplicationException
{
    public function __construct(null|string $message = null, array $details = [], null|Throwable $previus = null)
    {
        return parent::__construct($message ?? "Conflito de horários.", $details, $previus);
    }
}
