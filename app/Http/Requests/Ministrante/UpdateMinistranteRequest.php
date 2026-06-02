<?php

namespace App\Http\Requests\Ministrante;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMinistranteRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nome'        => ['required', 'string', 'max:255'],
            'email'       => ['nullable', 'email', 'max:255'],
            'telefone'    => ['nullable', 'string', 'max:20'],
            'cargo'       => ['nullable', 'string', 'max:255'],
            'instituicao' => ['nullable', 'string', 'max:255'],
        ];
    }
}