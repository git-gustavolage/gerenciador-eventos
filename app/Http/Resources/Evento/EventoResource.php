<?php

namespace App\Http\Resources\Evento;

use App\Http\Resources\Local\LocalResource;
use App\Support\S3Manager;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoResource extends JsonResource
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
            "id_local" => $this->id_local,
            "banner" => S3Manager::temporaryUrl($this->banner_path),
            "categorias" => $this->categorias,
            "formato" => $this->formato,
            "data_inicio" => $this->data_inicio?->format("Y-m-d H:i:s"),
            "data_fim" => $this->data_fim?->format("Y-m-d H:i:s"),
            "data_inicio_inscricoes" => $this->data_inicio_inscricoes?->format("Y-m-d H:i:s"),
            "data_fim_inscricoes" => $this->data_fim_inscricoes?->format("Y-m-d H:i:s"),
            "is_cancelado" => $this->is_cancelado,
            "is_publicado" => $this->is_publicado,
            "is_encerrado" => $this->is_encerrado,

            "local" => $this->whenLoaded("local", fn() => LocalResource::make($this->local)),
        ];
    }
}
