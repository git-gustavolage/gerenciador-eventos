<?php

namespace App\Http\Requests\Ministrante;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMinistranteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_atividade' => ['required', 'numeric', 'exists:atividades,id'],

            'nome' => ['required', 'max:255', 'string'],
            'email' => ['required', 'max:255', 'email'],
            'telefone' => ['nullable', 'max:255', 'string'],
            'cargo' => ['nullable', 'max:255', 'string'],
            'instituicao' => ['nullable', 'max:255', 'string'],
        ];
    }
}
