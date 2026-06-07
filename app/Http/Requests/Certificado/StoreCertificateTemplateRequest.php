<?php

namespace App\Http\Requests\Certificado;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'templateName'         => ['nullable', 'string', 'max:255'],
            'remove_background'    => ['nullable', 'boolean'],
            'fields'               => ['nullable', 'array'],
            'fields.*.id'          => ['required_with:fields', 'string'],
            'fields.*.label'       => ['required_with:fields', 'string', 'max:255'],
            'fields.*.content'     => ['required_with:fields', 'string', 'max:2000'],
            'fields.*.x'           => ['required_with:fields', 'numeric'],
            'fields.*.y'           => ['required_with:fields', 'numeric'],
            'fields.*.fontSize'    => ['required_with:fields', 'integer', 'min:6', 'max:120'],
            'fields.*.fontWeight'  => ['required_with:fields', 'string', 'in:normal,medium,bold'],
            'fields.*.color'       => ['required_with:fields', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'fields.*.align'       => ['required_with:fields', 'string', 'in:left,center,right'],
            'fields.*.width'       => ['nullable', 'numeric'],
        ];
    }
}