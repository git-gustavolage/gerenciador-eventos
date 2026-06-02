<?php

namespace App\Enum;

enum EventoFormatoEnum: string
{
    case PRESENCIAL = 'presencial';
    case HIBRIDO = 'híbrido';
    case REMOTO = 'remoto';
}
