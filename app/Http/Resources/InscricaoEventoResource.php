<?php

namespace App\Http\Resources;

use App\Http\Resources\Evento\EventoResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InscricaoEventoResource extends JsonResource
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
            'id_evento' => $this->id_atividade,
            'id_user' => $this->id_user,
            'data_inscricao' => $this->created_at->format('d/m/Y H:i:s'),
            'evento' => $this->whenLoaded('evento', EventoResource::make($this->evento)),
        ];
    }
}
