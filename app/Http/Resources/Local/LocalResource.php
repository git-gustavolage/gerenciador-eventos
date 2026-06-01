<?php

namespace App\Http\Resources\Local;

use App\Http\Resources\Ambiente\AmbienteResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocalResource extends JsonResource
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
            "nome" => $this->nome,
            "ambientes" => $this->whenLoaded("ambientes", fn() => AmbienteResource::collection($this->ambientes)),
        ];
    }
}
