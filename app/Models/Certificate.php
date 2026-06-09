<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class Certificate extends Model
{
  protected $fillable = [
    'id_user', 
    'id_evento', 
    'id_atividade',
    'template_id',
    'generated_file', 
    'issued_at', 
    'sent_at',
  ];

  #[Override]
  protected function casts(): array
  {
    return [
      'issued_at' => 'datetime',
      'sent_at' => 'datetime',
    ];
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class, 'id_user', 'id');
  }

  public function evento(): BelongsTo
  {
    return $this->belongsTo(Evento::class, 'id_evento', 'id');
  }

  public function template(): BelongsTo
  {
    return $this->belongsTo(CertificateTemplate::class, 'template_id', 'id');
  }
}