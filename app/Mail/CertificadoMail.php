<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CertificadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $participante,
        public string $evento,
        public string $link
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Seu certificado do evento ' . $this->evento . ' está disponível!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mails.certificado.emitido',
            with: [
                'participante' => $this->participante,
                'evento' => $this->evento,
                'link' => $this->link,
            ]
        );
    }
}