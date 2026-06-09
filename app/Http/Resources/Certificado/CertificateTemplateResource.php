<?php

namespace App\Http\Resources\Certificado;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateTemplateResource extends JsonResource
{
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'templateName' => $this->template_name,
      'bgUrl' => $this->background_path
        ? route('midia', $this->background_path)
        : null,
      'fields' => $this->fields ?? [],
      'eventName' => $this->evento?->titulo,
      'updatedAt' => $this->updated_at?->format('d/m/Y H:i'),
    ];
  }
}