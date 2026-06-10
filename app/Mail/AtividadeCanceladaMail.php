<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AtividadeCanceladaMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $atividade;
    public $evento;
    public $user;

    public function __construct($atividade, $evento, $user)
    {
        $this->atividade = $atividade;
        $this->evento = $evento;
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cancelamento de Atividade: ' . $this->atividade->titulo,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mails.atividade.cancelada',
        );
    }
}