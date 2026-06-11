<?php

namespace App\Http\Resources\Convite;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConviteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'id_evento' => $this->id_evento,
            'email' => $this->email,
            'enviado_em' => $this->created_at?->format('d/m/Y'),
            'expira_em' => $this->expira_em?->format('d/m/Y'),
            'pendente' => $this->isPendente(),
            'expirado' => $this->isExpirado(),
        ];
    }
}
