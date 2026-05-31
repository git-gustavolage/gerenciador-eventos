<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class Convite extends Model
{
    protected $fillable = ["id_evento", "email", "token", "aceito_em", "expira_em"];

    #[Override]
    protected function casts()
    {
        return [
            "aceito_em" => "datetime:Y-m-d H:i:s",
            "expira_em" => "datetime:Y-m-d H:i:s",
        ];
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, "id_evento", "id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "email", "email");
    }
}
