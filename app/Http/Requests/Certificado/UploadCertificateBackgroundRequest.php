<?php

namespace App\Http\Requests\Certificado;

use Illuminate\Foundation\Http\FormRequest;

class UploadCertificateBackgroundRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'background' => ['required', 'file', 'mimes:png,jpg,jpeg', 'max:20480'],
    ];
  }
}