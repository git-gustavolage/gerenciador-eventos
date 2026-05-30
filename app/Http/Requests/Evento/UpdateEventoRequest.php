<?php

namespace App\Http\Requests\Evento;

use App\Enum\EventoFormatoEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventoRequest extends FormRequest
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
        Rule::enum(EventoFormatoEnum::class)->when($this->formato);

        return [
            "titulo" => ["sometimes", "string", "max:255", "min:3"],
            "descricao" => ["sometimes", "nullable", "string", "max:255"],
            "formato" => ["sometimes", "string", "max:255"],
            "data_inicio" => ["sometimes", "date"],
            "data_fim" => ["sometimes", "date", "after:data_inicio"],
            "endereco" => ["sometimes", "string", "min:3", "max:255"],
        ];
    }

    public function messages()
    {
        return [
            "titulo.max" => "O título excede o tamanho máximo de 255 caracteres",
            "titulo.*" => "O título informado é inválido.",
        ];
    }
}
