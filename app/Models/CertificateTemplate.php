<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

class CertificateTemplate extends Model
{
  protected $fillable = [
    'id_evento', 
    'template_name', 
    'background_path', 
    'fields',
  ];

  #[Override]
  protected function casts(): array
  {
    return [
      'fields' => 'array',
    ];
  }

  public function evento(): BelongsTo
  {
    return $this->belongsTo(Evento::class, 'id_evento', 'id');
  }

  public function certificates(): HasMany
  {
    return $this->hasMany(Certificate::class, 'template_id', 'id');
  }
}