<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Localidade extends Model
{
    protected $fillable = [
        'nome',
        'estado',
        'cidade',
        'pais',
    ];
}
