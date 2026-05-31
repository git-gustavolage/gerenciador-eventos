<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Local extends Model
{
    protected $table = "locais";

    protected $fillable = ["nome"];

    public function ambientes(): HasMany
    {
        return $this->hasMany(Ambiente::class, "id_local", "id");
    }

    public function eventos(): HasMany
    {
        return $this->hasMany(Evento::class, "id_local", "id");
    }
}
