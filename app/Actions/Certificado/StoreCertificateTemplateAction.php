<?php

namespace App\Actions\Certificado;

use App\Enum\StoragePathEnum;
use App\Exceptions\CreationFailedException;
use App\Models\CertificateField;
use App\Models\CertificateTemplate;
use App\Support\StoreImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class StoreCertificateTemplateAction
{
  public function execute(
    int $id_evento,
    string $nome,
    ?UploadedFile $backgroundFile,
    array $fields = []
  ): CertificateTemplate {
    try {
      return DB::transaction(function () use ($id_evento, $nome, $backgroundFile, $fields) {

        $backgroundPath = null;
        if ($backgroundFile) {
          $backgroundPath = StoreImage::save(
            StoragePathEnum::CERTIFICADOS->value,
            $backgroundFile
          );
        }

        $template = CertificateTemplate::updateOrCreate(
          ['id_evento' => $id_evento],
          array_filter([
            'nome' => $nome,
            'background_path' => $backgroundPath,
          ], fn($v) => $v !== null)
        );

        $template->fields()->delete();

        foreach ($fields as $ordem => $field) {
          CertificateField::create([
            'template_id' => $template->id,
            'label' => $field['label'] ?? '',
            'conteudo' => $field['conteudo'] ?? '',
            'pos_x' => $field['pos_x'] ?? 0,
            'pos_y' => $field['pos_y'] ?? 0,
            'font_size' => $field['font_size'] ?? 24,
            'font_weight' => $field['font_weight'] ?? 'normal',
            'color' => $field['color'] ?? '#000000',
            'alignment' => $field['alignment'] ?? 'left',
            'ordem' => $field['ordem'] ?? $ordem,
          ]);
        }

        return $template->load('fields');
      });
    } catch (Exception $e) {
      throw new CreationFailedException('Não foi possível salvar o modelo de certificado.', [
        'message' => $e->getMessage(),
        'id_evento' => $id_evento,
      ]);
    }
  }
}