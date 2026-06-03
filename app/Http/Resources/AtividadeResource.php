<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AtividadeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "titulo" => $this->titulo,
            "descricao" => $this->descricao,
            "data_inicio" => $this->data_inicio->format("d/m/Y H:i:s"),
            "data_fim" => $this->data_inicio->format("d/m/Y H:i:s"),
            "ambiente" => $this->whenLoaded("ambiente", fn () => $this->ambiente),
        ];
    }
}
