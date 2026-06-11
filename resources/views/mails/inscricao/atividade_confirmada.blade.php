<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px 0; width: 100% !important; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #3b82f6; padding: 40px 32px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 12px; display: block; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    .body p { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px; margin-top: 0; }
    .footer { background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <span class="icon">✅</span>
      <h1>Vaga Garantida</h1>
    </div>
    <div class="body">
      <p>Olá, <strong>{{ $user->nome }}</strong>,</p>
      <p>Confirmamos que você garantiu sua vaga na atividade <strong>{{ $atividade->titulo }}</strong>.</p>
      <p>Lembre-se de comparecer ao local no horário programado para assinar a lista de presença e garantir seu certificado posteriormente.</p>

      <div class="btn-container" style="text-align: center; margin: 32px 0;">
        <a href="{{ route('meus_eventos') }}" class="btn" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">Ver Minha Agenda</a>
      </div>

      <div class="link-box" style="background-color: #f9fafb; padding: 16px; border-radius: 6px; text-align: center; border: 1px dashed #d1d5db; word-break: break-all;">
        <p class="small" style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p class="small" style="margin: 0;"><a href="{{ route('meus_eventos') }}" style="color: #3b82f6; font-size: 13px; text-decoration: underline;">{{ route('meus_eventos') }}</a></p>
      </div>
    </div>
    <div class="footer">
      <p>Atenciosamente,<br>Equipe E-IFRO</p>
    </div>
  </div>
</body>
</html>