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
            'nome'           => ['required', 'string', 'max:255'],
            'telefone'       => ['required', 'string', 'max:20'],
            'inscrever_evento'=> ['boolean'],
            'atividades'     => ['array'],
            'atividades.*'   => ['integer', 'exists:atividades,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required'      => 'O nome é obrigatório.',
            'telefone.required'  => 'O telefone é obrigatório.',
            'atividades.*.exists'=> 'Uma ou mais atividades selecionadas não existem.',
        ];
    }

    /**
     * Garante que ao menos uma das opções foi selecionada:
     * inscrição no evento OU ao menos uma atividade.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $inscreverEvento = (bool) $this->input('inscrever_evento', false);
            $atividades      = $this->input('atividades', []);

            if (!$inscreverEvento && empty($atividades)) {
                $validator->errors()->add(
                    'atividades',
                    'Selecione ao menos uma atividade ou marque a inscrição no evento geral.'
                );
            }
        });
    }
}