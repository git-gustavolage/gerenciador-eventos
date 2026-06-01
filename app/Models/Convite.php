<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class Convite extends Model
{
    protected $fillable = ["id_evento", "email", "token", "aceito_em", "expira_em", "cancelado_em"];

    #[Override]
    protected function casts(): array
    {
        return [
            "aceito_em" => "datetime",
            "expira_em" => "datetime",
            "cancelado_em" => "datetime",
        ];
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, "id_evento", "id");
    }

    public function destinatario()
    {
        return $this->belongsTo(User::class, "email", "email");
    }

    public function isCancelado(): bool
    {
        return $this->cancelado_em !== null;
    }

    public function isExpirado(): bool
    {
        return $this->expira_em?->isPast() ?? false;
    }

    public function isPendente(): bool
    {
        return !$this->isCancelado() && !$this->isAceito() && !$this->isExpirado();
    }

    public function isAceito(): bool
    {
        return $this->aceito_em !== null;
    }
}
