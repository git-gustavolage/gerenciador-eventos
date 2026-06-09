<?php

namespace App\Http\Resources\Evento;

use App\Http\Resources\AtividadeResource;
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
            "data_inicio" => $this->data_inicio?->format("d/m/Y H:i:s"),
            "data_fim" => $this->data_fim?->format("d/m/Y H:i:s"),
            "data_inicio_inscricoes" => $this->data_inicio_inscricoes?->format("d/m/Y H:i:s"),
            "data_fim_inscricoes" => $this->data_fim_inscricoes?->format("d/m/Y H:i:s"),
            "is_cancelado" => $this->is_cancelado,
            "is_publicado" => $this->is_publicado,
            "is_encerrado" => $this->is_encerrado,

            "local" => $this->whenLoaded("local", fn() => LocalResource::make($this->local)),
            "atividades" => $this->whenLoaded("atividades", fn() => AtividadeResource::collection($this->atividades)),
        ];
    }
}
