<?php

namespace App\Http\Requests\Atividade;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAtividadeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo'              => ['required', 'string', 'max:255'],
            'descricao'           => ['nullable', 'string'],
            'local'               => ['nullable', 'string', 'max:255'],
            'data_inicio'         => ['required', 'date'],
            'data_fim'            => ['required', 'date', 'after_or_equal:data_inicio'],
            'limite_participantes'=> ['nullable', 'integer', 'min:1'],
            'ministrantes'        => ['nullable', 'array'],
            'ministrantes.*'      => ['integer', 'exists:ministrantes,id'],
        ];
    }
}
