<?php

namespace App\Enum;

enum EventoFormatoEnum: string
{
    case PRESENCIAL = 'presencial';
    case HIBRIDO = 'hibrido';
    case REMOTO = 'remoto';
}
