<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ambiente extends Model
{
  protected $fillable = [
    'nome',
    'capacidade',
    'id_local',
  ];
  public function local(): BelongsTo
  {
    return $this->belongsTo(Local::class, 'id_local', 'id');
  }
  public function atividades(): HasMany
  {
    return $this->hasMany(Atividade::class, 'id_ambiente', 'id');
  }
}