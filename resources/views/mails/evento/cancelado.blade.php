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
    .header { background-color: #ef4444; padding: 40px 32px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 12px; display: block; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    .body p { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px; margin-top: 0; }
    .body p strong { color: #111827; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #4b5563; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; }
    .link-box { background-color: #f9fafb; padding: 16px; border-radius: 6px; text-align: center; word-break: break-all; border: 1px dashed #d1d5db; }
    .small { font-size: 13px; color: #6b7280; margin: 0 0 4px 0; }
    .small a { color: #4b5563; text-decoration: underline; }
    .footer { background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; }
  </style>
</head>
<body style="background-color: #f4f7f6; margin: 0; padding: 20px 0; font-family: Arial, sans-serif;">
  <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
    
    <div class="header" style="background-color: #ef4444; padding: 40px 32px; text-align: center;">
      <span class="icon" style="font-size: 48px; display: block; margin-bottom: 12px;">📅</span>
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Aviso de Cancelamento</h1>
    </div>
    
    <div class="body" style="padding: 40px 32px;">
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Olá, <strong style="color: #111827;">{{ $user->nome }}</strong>,</p>
      
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Infelizmente, informamos que o evento <strong style="color: #111827;">{{ $evento->titulo }}</strong>, no qual você estava inscrito(a), foi cancelado pela organização.</p>
      
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Como consequência, todas as atividades programadas e inscrições vinculadas a este evento foram suspensas.</p>
      
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Caso tenha dúvidas, pedimos que entre em contato diretamente com a organização do evento através da plataforma E-IFRO.</p>

      <div class="btn-container" style="text-align: center; margin: 32px 0;">
        <a href="{{ url('/') }}" class="btn" style="display: inline-block; background-color: #4b5563; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">Acessar Plataforma E-IFRO</a>
      </div>

      <div class="link-box" style="background-color: #f9fafb; padding: 16px; border-radius: 6px; text-align: center; border: 1px dashed #d1d5db; word-break: break-all;">
        <p class="small" style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p class="small" style="margin: 0;"><a href="{{ url('/') }}" style="color: #4b5563; font-size: 13px; text-decoration: underline;">{{ url('/') }}</a></p>
      </div>
    </div>
    
    <div class="footer" style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">Este é um e-mail automático enviado pela plataforma E-IFRO.<br>Por favor, não responda a esta mensagem.</p>
    </div>
    
  </div>
</body>
</html>