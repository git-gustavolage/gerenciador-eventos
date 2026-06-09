<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body { 
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      background-color: #f4f7f6; 
      margin: 0; 
      padding: 20px 0; 
      width: 100% !important; 
    }

    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
      border: 1px solid #e5e7eb; 
    }
    
    .header { 
      background-color: #10b981; 
      padding: 40px 32px; 
      text-align: center; 
    }
    
    .header .icon { 
      font-size: 48px; 
      margin-bottom: 12px; 
      display: block; 
    }

    .header h1 { 
      color: #ffffff; 
      font-size: 24px; 
      font-weight: 700; 
      margin: 0; 
      letter-spacing: -0.5px; 
    }

    .body { 
      padding: 40px 32px; 
    }
    
    .body p { 
      font-size: 16px; 
      line-height: 1.6; 
      color: #4b5563; 
      margin-bottom: 20px; 
      margin-top: 0; 
    }
    
    .body p strong { 
      color: #111827; 
    }

    .btn-container { 
      text-align: center; 
      margin: 32px 0; 
    }
    
    .btn { 
      display: inline-block; 
      background-color: #10b981; 
      color: #ffffff !important;
      text-decoration: none; 
      padding: 14px 32px; 
      border-radius: 6px; 
      font-weight: 600; 
      font-size: 16px; 
      transition: background-color 0.2s; 
    }

    .link-box { 
      background-color: #f9fafb; 
      padding: 16px; 
      border-radius: 6px; 
      text-align: center; 
      word-break: break-all; 
      border: 1px dashed #d1d5db;
    }
    
    .small { 
      font-size: 13px; 
      color: #6b7280; 
      margin: 0 0 4px 0; 
    }
    
    .small a { 
      color: #10b981; 
      text-decoration: underline; 
    }

    .footer { 
      background-color: #f9fafb; 
      padding: 24px 32px; 
      text-align: center; 
      border-top: 1px solid #e5e7eb; 
    }
    
    .footer p { 
      font-size: 12px; 
      color: #9ca3af; 
      margin: 0; 
      line-height: 1.5; 
    }
  </style>
</head>
<body>
  <div class="email-container">
    
    <div class="header">
      <span class="icon">🎓</span>
      <h1>Seu certificado chegou!</h1>
    </div>
    
    <div class="body">
      <p>Olá, <strong>{{ $participante }}</strong>!</p>
      
      <p>Parabéns pela conclusão! Seu certificado de participação no evento <strong>{{ $evento }}</strong> já foi gerado com sucesso e está pronto para ser guardado.</p>
      
      <div class="btn-container">
        <a href="{{ $link }}" class="btn" style="color: #ffffff;">Baixar Meu Certificado</a>
      </div>
      
      <div class="link-box">
        <p class="small">Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p class="small"><a href="{{ $link }}">{{ $link }}</a></p>
      </div>
    </div>
    
    <div class="footer">
      <p>Este é um e-mail automático gerado pelo sistema.<br>Por favor, não responda a esta mensagem.</p>
    </div>
    
  </div>
</body>
</html>