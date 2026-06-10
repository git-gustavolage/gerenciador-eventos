<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventoCanceladoMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $evento;
    public $user;
    public function __construct($evento, $user)
    {
        $this->evento = $evento;
        $this->user = $user;
    }
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cancelamento do evento ' . $this->evento->titulo,
        );
    }
    public function content(): Content
    {
        return new Content(
            view: 'mails.evento.cancelado',
        );
    }
}