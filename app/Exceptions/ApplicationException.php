<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class ApplicationException extends Exception
{
    public function __construct(?string $message = null, public array $details = [])
    {
        $message ??= 'Erro ao realizar ação';

        if (! empty($details)) {
            Log::error($message, $details);
        }

        return parent::__construct($message, 0, null);
    }

    public function status(): int
    {
        return 422;
    }

    public function getDetails(): array
    {
        return $this->details;
    }

    public function toArray(): array
    {
        return [
            'success' => false,
            'message' => $this->getMessage(),
        ];
    }
}
