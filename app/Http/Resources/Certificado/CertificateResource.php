<?php

namespace App\Http\Resources\Certificado;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'id_user' => $this->id_user,
      'id_evento' => $this->id_evento,
      'id_atividade' => $this->id_atividade,
      'download_url' => $this->generated_file
        ? route('eventos.organizacao.certificados.download', $this->id)
        : null,
      'issued_at' => $this->issued_at?->format('d/m/Y H:i'),
      'sent_at' => $this->sent_at?->format('d/m/Y H:i'),
      'evento' => $this->whenLoaded('evento', fn() => [
        'id' => $this->evento->id,
        'titulo' => $this->evento->titulo,
      ]),
    ];
  }
}