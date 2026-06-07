<?php

namespace App\Actions\Atividade;

use App\Exceptions\InvalidStateException;
use App\Exceptions\ScheduleConflictException;
use App\Exceptions\UpdateFailedException;
use App\Models\Ambiente;
use App\Models\Atividade;
use App\Models\Evento;
use App\Models\User;
use App\Validators\DateRangeValidator;
use App\Validators\PeriodContainmentValidator;
use App\Validators\ScheduleConflictValidator;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Gate;

class UpdateAtividadeAction
{
    public function __construct(
        private DateRangeValidator $dateRangeValidator,
        private PeriodContainmentValidator $periodContainmentValidator,
        private ScheduleConflictValidator $scheduleConflictValidator,
    ) {}

    public function execute(int $id_user, int $id, array $data): void
    {
        $user = User::query()->findOrFail($id_user);
        $atividade = Atividade::query()->with("evento")->findOrFail($id);

        $this->validate($user, $atividade, $data);

        try {
            $atividade->update([
                "titulo" => $data["titulo"],
                "descricao" => $data["descricao"] ?? null,
                "id_ambiente" => $data["id_ambiente"],
                "data_inicio" => $data["data_inicio"],
                "data_fim" => $data["data_fim"],
                "limite_participantes" => $data["limite_participantes"] ?? null,
            ]);
        } catch (Exception $e) {
            throw new UpdateFailedException("Erro ao atualizar atividade.", [
                "message" => $e->getMessage(),
                "id_user" => $id_user,
            ]);
        }
    }

    private function validate(User $user, Atividade $atividade, array $data): void
    {
        Gate::forUser($user)->authorize("update", $atividade);

        $evento = Evento::query()->findOrFail($atividade->id_evento);
        $ambiente = Ambiente::query()->findOrFail($data["id_ambiente"]);

        if ($atividade->is_cancelada) {
            throw new InvalidStateException("Não é possível editar uma atividade cancelada.");
        }

        if ($evento->is_cancelado) {
            throw new InvalidStateException("Não é possível editar atividades de um evento cancelado.");
        }

        if ($evento->is_encerrado) {
            throw new InvalidStateException("Não é possível editar atividades de um evento encerrado.");
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
            ->whereKeyNot($atividade->id)
            ->get()
            ->map(
                fn($item) => [
                    "start" => $item->data_inicio,
                    "end" => $item->data_fim,
                ],
            );

        if (!$this->scheduleConflictValidator->validate($inicio, $fim, $intervals)) {
            throw new ScheduleConflictException("Já existe uma atividade agendada para este ambiente no período informado.");
        }
    }
}
