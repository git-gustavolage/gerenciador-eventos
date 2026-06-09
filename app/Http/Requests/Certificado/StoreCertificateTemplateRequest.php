<?php

namespace App\Http\Requests\Certificado;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if (is_string($this->fields)) {
            $decodificado = json_decode($this->fields, true) ?? [];
            
            $this->merge([
                'fields' => is_array($decodificado) ? array_values($decodificado) : [],
            ]);
        } elseif (is_array($this->fields)) {
            $this->merge([
                'fields' => array_values($this->fields),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'templateName'         => ['nullable', 'string', 'max:255'],
            'remove_background'    => ['nullable', 'boolean'],
            'background'           => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'fields'               => ['nullable', 'array'],
            'fields.*.id'          => ['required', 'string'],
            'fields.*.label'       => ['required', 'string', 'max:255'],
            'fields.*.content'     => ['nullable', 'string', 'max:2000'],
            'fields.*.x'           => ['required', 'numeric'],
            'fields.*.y'           => ['required', 'numeric'],
            'fields.*.fontSize'    => ['required', 'integer', 'min:6', 'max:120'],
            'fields.*.fontWeight'  => ['required', 'string', 'in:normal,medium,bold'],
            'fields.*.color'       => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'fields.*.align'       => ['required', 'string', 'in:left,center,right'],
            'fields.*.width'       => ['nullable', 'numeric'],
        ];
    }
}