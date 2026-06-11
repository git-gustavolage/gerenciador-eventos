<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InscricaoEventoConfirmadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $evento;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($evento, $user)
    {
        $this->evento = $evento;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Inscrição Confirmada: ' . $this->evento->titulo,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mails.inscricao.evento_confirmada',
        );
    }
}
