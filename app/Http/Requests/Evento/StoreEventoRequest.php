<?php

namespace App\Http\Requests\Evento;

use App\Enum\EventoFormatoEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        Rule::enum(EventoFormatoEnum::class)->when(strtolower($this->formato));

        return [
            "titulo" => ["required", "string", "min:3", "max:255"],
            "descricao" => ["sometimes", "nullable", "string", "max:255"],
            "id_local" => ["required", "integer", "exists:locais,id"],
            "formato" => ["sometimes", "string", "max:255"],
            "categorias" => ["required", "array", "min:1"],
        ];
    }
}
