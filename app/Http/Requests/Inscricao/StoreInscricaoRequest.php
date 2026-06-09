<?php

namespace App\Http\Requests\Inscricao;

use Illuminate\Foundation\Http\FormRequest;

class StoreInscricaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('web')->check();
    }

    public function rules(): array
    {
        return [
            'id_evento' => ['required', 'exists:eventos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_evento.*' => 'Não foi possível identificar o evento. Tente novamente.',
        ];
    }
}
