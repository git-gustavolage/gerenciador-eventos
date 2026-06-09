<?php

namespace App\Actions\Certificado;

use App\Enum\StoragePathEnum;
use App\Exceptions\CreationFailedException;
use App\Mail\CertificadoMail;
use App\Models\Certificate;
use App\Models\CertificateTemplate;
use App\Models\Atividade;
use App\Models\User;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class IssueCertificateAction
{
  public function execute(int $id_user, int $id_evento, int $id_atividade, bool $sendEmail = true): Certificate
  {
    try {
      return DB::transaction(function () use ($id_user, $id_evento, $id_atividade, $sendEmail) {
        $template = CertificateTemplate::with('evento.atividades')
          ->where('id_evento', $id_evento)
          ->firstOrFail();

        $user = User::findOrFail($id_user);
        $evento = $template->evento;
        $atividade = Atividade::findOrFail($id_atividade);
        $issuedAt = Carbon::now();

        $vars = $this->resolveVariables($user, $evento, $atividade, $issuedAt);

        $certificate = Certificate::updateOrCreate(
          ['id_user' => $id_user, 'id_atividade' => $id_atividade], 
          [
            'id_evento' => $id_evento,
            'template_id' => $template->id,
            'generated_file' => null,
            'issued_at' => $issuedAt,
            'sent_at' => null,
          ],
        );

        if ($sendEmail) {
          $link = route('eventos.organizacao.certificados.download', $certificate->id);

          Mail::to($user->email)->send(
            new CertificadoMail($user->nome, $evento->titulo, $link),
          );

          $certificate->update(['sent_at' => Carbon::now()]);
        }

        return $certificate;
      });
    } catch (Exception $e) {
      Log::error('Falha interna na IssueCertificateAction', [
          'message' => $e->getMessage(),
          'linha' => $e->getLine(),
          'arquivo' => $e->getFile()
      ]);

      throw new CreationFailedException(
        'Não foi possível emitir o certificado.',
        ['message' => $e->getMessage(), 'id_user' => $id_user, 'id_atividade' => $id_atividade],
      );
    }
  }

  private function resolveVariables(User $user, $evento, Atividade $atividade, Carbon $issuedAt): array
  {
    $diffEmMinutos = ($atividade->data_inicio && $atividade->data_fim) 
        ? $atividade->data_inicio->diffInMinutes($atividade->data_fim) 
        : 0;
    
    $horas = floor($diffEmMinutos / 60);
    $minutos = $diffEmMinutos % 60;
    $cargaFormatada = $horas . 'h' . ($minutos > 0 ? $minutos . 'min' : '');

    return [
      '{{nome_participante}}' => $user->nome,
      '{{nome_evento}}'       => $evento->titulo,
      '{{nome_atividade}}'    => $atividade->titulo,
      '{{data_atividade}}'    => $atividade->data_inicio?->format('d/m/Y') ?? '',
      '{{horario_atividade}}' => ($atividade->data_inicio && $atividade->data_fim) 
          ? $atividade->data_inicio->format('H:i') . ' às ' . $atividade->data_fim->format('H:i')
          : ($atividade->data_inicio?->format('H:i') ?? ''),
      '{{carga_horaria}}'     => $cargaFormatada,
      '{{data_emissao}}' => $issuedAt->timezone('America/Porto_Velho')->format('d/m/Y'),
    ];
  }  
}