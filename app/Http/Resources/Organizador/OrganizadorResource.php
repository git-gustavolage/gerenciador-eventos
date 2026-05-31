<?php

namespace App\Http\Resources\Organizador;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizadorResource extends JsonResource
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
            'nome' => $this->user->nome,
            'email' => $this->user->email,
            'perfil' => $this->perfil,
        ];
    }
}
