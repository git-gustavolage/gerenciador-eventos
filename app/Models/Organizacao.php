<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Organizacao extends Model
{
    protected $fillable = [
        'nome',
        'emial',
        'telefone',
    ];

    public function users(): HasManyThrough
    {
        return $this->hasManyThrough(User::class, OrganizacaoUser::class);
    }
}
