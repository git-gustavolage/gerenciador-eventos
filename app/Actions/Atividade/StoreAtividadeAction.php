<?php

namespace App\Actions\Atividade;

use App\Exceptions\CreationFailedException;
use App\Exceptions\InvalidStateException;
use App\Exceptions\ScheduleConflictException;
use App\Models\Ambiente;
use App\Models\Atividade;
use App\Models\Evento;
use App\Validators\DateRangeValidator;
use App\Validators\PeriodContainmentValidator;
use App\Validators\ScheduleConflictValidator;
use Carbon\Carbon;
use Exception;

class StoreAtividadeAction
{
    public function __construct(
        private DateRangeValidator $dateRangeValidator,
        private PeriodContainmentValidator $periodContainmentValidator,
        private ScheduleConflictValidator $scheduleConflictValidator,
    ) {}

    public function execute(int $id_user, array $data): void
    {
        $this->validate($id_user, $data);

        try {
            $atividade = Atividade::create([
                "id_evento" => $data["id_evento"],
                "id_ambiente" => $data["id_ambiente"],
                "titulo" => $data["titulo"],
                "descricao" => $data["descricao"] ?? null,
                "data_inicio" => $data["data_inicio"],
                "data_fim" => $data["data_fim"],
                "is_cancelada" => false,
                "limite_participantes" => $data["limite_participantes"] ?? null,
            ]);

            if (!empty($data["ministrantes"])) {
                $atividade->ministrantes()->sync($data["ministrantes"]);
            }
        } catch (Exception $e) {
            throw new CreationFailedException("Erro ao cadastrar nova atividade.", [
                "message" => $e->getMessage(),
                "id_user" => $id_user,
            ]);
        }
    }

    private function validate(int $id_user, array $data): void
    {
        $evento = Evento::query()->findOrFail($data["id_evento"]);
        $ambiente = Ambiente::query()->findOrFail($data["id_ambiente"]);

        if ($evento->is_cancelado) {
            throw new InvalidStateException("Não é possível cadastrar a atividade pois este evento foi cancelado.");
        }

        if ($evento->is_encerrado) {
            throw new InvalidStateException("Não é possível cadastrar a atividade pois este evento foi encerrado.");
        }

        if ($ambiente->id_local !== $evento->id_local) {
            throw new InvalidStateException(
                "Não é possível cadastrar a atividade pois o ambiente selecionado não existe no local indicado para a realização do evento.",
            );
        }

        $ref_inicio = new Carbon($evento->data_inicio);
        $ref_fim = new Carbon($evento->data_fim);

        $inicio = Carbon::parse($data["data_inicio"]);
        $fim = Carbon::parse($data["data_fim"]);

        if (!$this->dateRangeValidator->validate($inicio, $fim)) {
            throw new InvalidStateException("A data de término da atividade deve ser posterior à data de início.");
        }

        if (!$this->periodContainmentValidator->validate($ref_inicio, $ref_fim, $inicio, $fim)) {
            throw new InvalidStateException("A atividade deve ocorrer dentro do período do evento.");
        }

        $intervals = Atividade::query()
            ->whereBelongsTo($evento)
            ->whereBelongsTo($ambiente)
            ->where("is_cancelada", false)
            ->get()
            ->map(
                fn($atividade) => [
                    "start" => $atividade->data_inicio,
                    "end" => $atividade->data_fim,
                ],
            );

        if (!$this->scheduleConflictValidator->validate($inicio, $fim, $intervals)) {
            throw new ScheduleConflictException(
                "Já existe uma atividade agendada para este ambiente no período informado.",
            );
        }
    }
}
