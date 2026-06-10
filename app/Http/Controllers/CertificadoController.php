<?php

namespace App\Http\Controllers;

use App\Actions\Certificado\IssueCertificateAction;
use App\Http\Resources\Certificado\CertificateResource;
use App\Models\Certificate;
use App\Models\Inscricao;
use App\Models\User;
use App\Support\CurrentEvent;
use App\Support\S3Manager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CertificadoController extends Controller
{
  public function emissao()
  {
    $evento = CurrentEvent::get();

    $atividades = \App\Models\Atividade::where('id_evento', $evento->id)
      ->where('is_cancelada', false)
      ->with(['inscricoes.user'])
      ->get()
      ->map(function ($ativ) {
          return [
              'id' => $ativ->id,
              'titulo' => $ativ->titulo,
              'participantes' => $ativ->inscricoes->map(fn($ins) => [
                  'id_user' => $ins->id_user,
                  'nome' => $ins->user->nome,
                  'email' => $ins->user->email,
              ])
          ];
      });

    $certificates = Certificate::where('id_evento', $evento->id)->get();

    return inertia('Organizacao/Certificado/Emissao', [
      'atividades' => $atividades,
      'certificates' => CertificateResource::collection($certificates),
    ]);
  }

  public function issue(Request $request, IssueCertificateAction $issueAction)
  {
    $request->validate([
        'id_user' => ['required', 'integer', 'exists:users,id'],
        'id_atividade' => ['required', 'integer', 'exists:atividades,id'],
        'send_email' => ['nullable', 'boolean'],
    ]);

    $evento = CurrentEvent::get();
    $sendEmail = $request->boolean('send_email', true);

    try {
        $issueAction->execute(
            $request->integer('id_user'),
            $evento->id,
            $request->integer('id_atividade'),
            $sendEmail
        );
    } catch (\Throwable $e) {
        Log::error('Erro ao emitir certificado individual', [
            'error' => $e->getMessage(),
            'id_user' => $request->integer('id_user'),
        ]);
        return back()->withErrors(['error' => 'Não foi possível emitir o certificado.']);
    }

    return back();
  }

 public function issueBatch(Request $request, IssueCertificateAction $issueAction)
  {
    $request->validate([
      'id_atividade' => ['nullable', 'integer', 'exists:atividades,id'],
      'send_email' => ['nullable', 'boolean'],
    ]);

    $evento = CurrentEvent::get();
    $idAtividade = $request->input('id_atividade');
    $sendEmail = $request->boolean('send_email', true);

    $query = InscricaoAtividade::query()
      ->with('user', 'atividade')
      ->whereHas('atividade', function ($q) use ($evento) {
          $q->where('id_evento', $evento->id);
      });

    if ($idAtividade) {
        $query->where('id_atividade', $idAtividade);
    }

    $inscricoes = $query->get();

    $certificadosExistentes = Certificate::where('id_evento', $evento->id)
        ->get()
        ->mapWithKeys(fn($c) => [$c->id_user . '-' . $c->id_atividade => true]);

    $emitidos = 0;

    foreach ($inscricoes as $inscricao) {
      if (isset($certificadosExistentes[$inscricao->id_user . '-' . $inscricao->id_atividade])) {
          continue;
      }

      try {
        $issueAction->execute(
            $inscricao->id_user,
            $evento->id,
            $inscricao->id_atividade,
            $sendEmail
        );
        $emitidos++;
      } catch (\Throwable $e) {
        Log::error('Erro ao emitir certificado em lote', [
          'id_user' => $inscricao->id_user,
          'id_atividade' => $inscricao->id_atividade,
          'error' => $e->getMessage(),
        ]);
      }
    }

    return back();
  }

  public function download(int $id)
  {
    $certificate = Certificate::with(['template', 'user', 'evento.atividades'])->findOrFail($id);
    $user = auth('web')->user();

    if ($user) {
        $isOwner = $certificate->id_user === $user->id;
        $isOrganizer = $certificate->evento->id_user === $user->id;
        $isAdmin = $user->admin;
        abort_unless($isOwner || $isOrganizer || $isAdmin, 403, 'Acesso Negado.');
    }

    $template = $certificate->template;
    abort_if(!$template, 404);

    $evento = $certificate->evento;
    $userObj = $certificate->user;
    
    $atividade = \App\Models\Atividade::find($certificate->id_atividade);
    
    $diffEmMinutos = ($atividade && $atividade->data_inicio && $atividade->data_fim) 
        ? $atividade->data_inicio->diffInMinutes($atividade->data_fim) : 0;
    $horas = floor($diffEmMinutos / 60);
    $minutos = $diffEmMinutos % 60;
    $cargaFormatada = $horas . 'h' . ($minutos > 0 ? $minutos . 'min' : '');

    $vars = [
      '{{nome_participante}}' => $userObj->nome,
      '{{nome_evento}}' => $evento->titulo,
      '{{nome_atividade}}' => $atividade?->titulo ?? '',
      '{{data_atividade}}' => $atividade?->data_inicio?->format('d/m/Y') ?? '',
      '{{horario_atividade}}' => ($atividade && $atividade->data_inicio && $atividade->data_fim) 
          ? $atividade->data_inicio->format('H:i') . ' às ' . $atividade->data_fim->format('H:i')
          : ($atividade?->data_inicio?->format('H:i') ?? ''),
      '{{carga_horaria}}' => $cargaFormatada,
      '{{data_emissao}}' => $certificate->issued_at
    ? $certificate->issued_at->timezone('America/Porto_Velho')->format('d/m/Y H:i') 
    : now()->timezone('America/Porto_Velho')->format('d/m/Y H:i'),
    ];

    $w = 1122;
    $h = 794;

    $disk = \Illuminate\Support\Facades\Storage::disk('local');
    $bgImgHtml = '';
    if ($template->background_path && $disk->exists($template->background_path)) {
        $mime = $disk->mimeType($template->background_path);
        $base64 = base64_encode($disk->get($template->background_path));
        $bgDataUrl = "data:{$mime};base64,{$base64}";
        $bgImgHtml = "<img src=\"{$bgDataUrl}\" style=\"position: absolute; top: 0; left: 0; width: {$w}px; height: {$h}px; z-index: -1;\" />";
    } else {
        $bgImgHtml = "<div style=\"position: absolute; top: 0; left: 0; width: {$w}px; height: {$h}px; background: #ffffff; z-index: -1;\"></div>";
    }

    $textosHtml = '';
    $fields = is_array($template->fields) ? $template->fields : json_decode($template->fields ?? '[]', true);
    
    foreach ($fields as $campo) {
      $texto = strtr($campo['content'] ?? '', $vars);
      $texto = htmlspecialchars($texto, ENT_QUOTES);
      
      $texto = nl2br($texto);

      $fw = match ($campo['fontWeight'] ?? 'normal') {
          'bold' => 'bold',
          'medium' => '500',
          default => 'normal',
      };

      $align = $campo['align'] ?? 'center';
      $x = (float)($campo['x'] ?? 0);
      $y = (float)($campo['y'] ?? 0);
      $fontSize = (float)($campo['fontSize'] ?? 14);
      $color = htmlspecialchars($campo['color'] ?? '#000000', ENT_QUOTES);
      $fieldWidth = (float)($campo['width'] ?? $w); 
      $top = $y - $fontSize;
      $left = $x - ($fieldWidth / 2);

      $textosHtml .= "
            <div style=\"position: absolute; top: {$top}px; left: {$left}px; width: {$fieldWidth}px; text-align: {$align}; font-size: {$fontSize}px; font-weight: {$fw}; color: {$color}; font-family: Georgia, 'Times New Roman', serif; line-height: 1.5; word-wrap: break-word;\">
                {$texto}
            </div>";
    }

    $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"utf-8\">
            <style>
                @page { margin: 0; size: {$w}px {$h}px; }
                body { margin: 0; padding: 0; width: {$w}px; height: {$h}px; position: relative; }
            </style>
        </head>
        <body>
            {$bgImgHtml}
            {$textosHtml}
        </body>
        </html>";

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)
        ->setPaper([0, 0, $w, $h], 'landscape')
        ->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'dpi' => 96
        ]);


    $tituloAtividade = $atividade?->titulo ?? 'atividade';
    $nomeSeguro = \Illuminate\Support\Str::slug($tituloAtividade);
    $nomeArquivo = 'certificado_' . $nomeSeguro . '.pdf';

    return $pdf->download($nomeArquivo);
  }

  public function meusCertificados()
  {
    $user = auth('web')->user();
    $certificates = Certificate::with('evento')
      ->where('id_user', $user->id)
      ->orderByDesc('issued_at')
      ->get();

    return inertia('Organizacao/Certificado/MeusCertificados', [
      'certificates' => CertificateResource::collection($certificates),
    ]);
  }
}