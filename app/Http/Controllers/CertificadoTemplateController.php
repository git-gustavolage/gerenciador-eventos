<?php

namespace App\Http\Controllers;

use App\Enum\StoragePathEnum;
use App\Http\Requests\Certificado\StoreCertificateTemplateRequest;
use App\Http\Resources\Certificado\CertificateTemplateResource;
use App\Models\CertificateTemplate;
use App\Support\CurrentEvent;
use App\Support\StoreImage;

class CertificadoTemplateController extends Controller
{
    public function edit()
    {
        $evento = CurrentEvent::get()->load('atividades');
        $template = CertificateTemplate::where('id_evento', $evento->id)->first();

        return inertia('Organizacao/Certificado/Form', [
            'evento' => $evento,
            'template' => $template ? CertificateTemplateResource::make($template) : null,
        ]);
    }

    public function store(StoreCertificateTemplateRequest $request)
    {
        $evento = CurrentEvent::get();
        $template = CertificateTemplate::where('id_evento', $evento->id)->first();
        $fieldsInput = $request->input('fields', []);
        if (is_string($fieldsInput)) {
            $fieldsInput = json_decode($fieldsInput, true) ?? [];
        }

        $fieldsFormatados = is_array($fieldsInput) ? array_values($fieldsInput) : [];

        $data = [
            'template_name' => 'Modelo Padrão',
            'fields' => $fieldsFormatados,
        ];

        if ($request->hasFile('background')) {
            $data['background_path'] = StoreImage::save(
                StoragePathEnum::CERT_BACKGROUNDS->value,
                $request->file('background')
            );
        }

        if ($template) {
            $template->update($data);
        } else {
            $data['id_evento'] = $evento->id;
            CertificateTemplate::create($data);
        }

        return redirect()->route('eventos.organizacao.certificados.edit')->with('success', 'Modelo de certificado salvo com sucesso!');
    }
}