<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organizador extends Model
{
    protected $table = "organizadores";

    protected $fillable = ["perfil", "id_evento", "id_user"];

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class, "id_evento", "id");
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "id_user", "id");
    }
}
