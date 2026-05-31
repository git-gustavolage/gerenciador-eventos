<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Convite para organização de evento</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1>Convite para organização de evento</h1>

    <p>Olá,</p>

    <p>
        <strong>{{ $inviter }}</strong> convidou você para participar da organização do evento
        <strong>{{ $evento }}</strong>.
    </p>

    <p>Caso aceite o convite, você passará a ter acesso às funcionalidades de gerenciamento do evento.</p>

    <p style="margin: 32px 0;">
        <a
            href="{{ $link }}"
            style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #00bc7d;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            "
        >
            Aceitar convite
        </a>
    </p>

    <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>

    <p style="word-break: break-all;">
        <a href="{{ $link }}">
            {{ $link }}
        </a>
    </p>

    <p>Este convite expira em 7 dias.</p>

    <p>
        Atenciosamente,<br>
        Equipe de Organização
    </p>
</body>
</html>
