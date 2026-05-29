<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;
use Throwable;

class ApplicationException extends Exception
{
    public function __construct(
        null|string $message = null,
        public array $details = [],
        protected null|Throwable $previus = null,
    ) {
        $message ??= "Erro ao realizar ação.";

        if (!empty($details)) {
            Log::error($message, $details);
        }

        return parent::__construct($message, 0, $previus);
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
            "success" => false,
            "message" => $this->getMessage(),
        ];
    }
}
