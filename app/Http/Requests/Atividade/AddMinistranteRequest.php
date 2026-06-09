<?php

namespace App\Http\Requests\Atividade;

use Illuminate\Foundation\Http\FormRequest;

class AddMinistranteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('web')->check();
    }

    public function rules(): array
    {
        return [
            'id_atividade' => ['required', 'integer', 'exists:atividades,id'],
            'id_ministrante' => ['required', 'integer', 'exists:ministrantes,id'],
        ];
    }
}
