<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InscricaoAtividadeResource extends JsonResource
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
            'id_atividade' => $this->id_atividade,
            'id_user' => $this->id_user,
            'status' => $this->status,
            'presenca_confirmada' => $this->compareceu ?? false,
            'data_inscricao' => $this->created_at->format('d/m/Y H:i:s'),
            'atividade' => $this->whenLoaded('atividade', AtividadeResource::make($this->atividade)),
        ];
    }
}
