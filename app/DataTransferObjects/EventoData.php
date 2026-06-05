<?php

namespace App\DataTransferObjects;

use App\Enum\EventoFormatoEnum;

final readonly class EventoData
{
    public function __construct(
        public string $titulo,
        public ?string $descricao,
        public EventoFormatoEnum $formato,
        public array $categorias,
        public ?int $id_local = null,
    ) {}
}
