<?php

namespace App\Actions\Evento;

use App\Enum\StoragePathEnum;
use App\Exceptions\UpdateFailedException;
use App\Models\Atividade;
use App\Models\Evento;
use App\Models\User;
use App\Support\S3Manager;
use App\Support\StoreImage;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class UpdateEventoAction
{
    public function execute(int $id_user, int $evento_id, array $input): Evento
    {
        $user = User::query()->findOrFail($id_user);
        $evento = Evento::query()->findOrFail($evento_id);

        $this->validate($user, $evento);

        $oldBanner = $evento->banner_path;

        if ($banner = $input["banner"] ?? null) {
            try {
                $input["banner_path"] = StoreImage::save(StoragePathEnum::BANNERS->value, $banner);

                unset($input["banner"]);
            } catch (Exception $e) {
                throw new UpdateFailedException("Ocorreu um erro ao salvar a nova imagem. Tente novamente.", [
                    "message" => $e->getMessage(),
                ]);
            }
        }

        $estavaCancelado = $evento->is_cancelado;

        if (isset($input['is_cancelado']) && $input['is_cancelado'] && !$estavaCancelado) {

            $userIdsEvento = $evento->inscricoesEvento()->pluck('id_user');
            dump($userIdsEvento);

            $userIdsAtividades = DB::table('inscricoes_atividades')
                ->join('atividades', 'atividades.id', '=', 'inscricoes_atividades.id_atividade')
                ->where('atividades.id_evento', $evento->id)
                ->pluck('id_user');

            $userIdsUnicos = $userIdsEvento->merge($userIdsAtividades)->unique();

            if ($userIdsUnicos->isNotEmpty()) {
                $inscritos = User::query()->whereIn('id', $userIdsUnicos)->get();
                foreach ($inscritos as $inscrito) {
                    Mail::to($inscrito->email)->send(new EventoCanceladoMail($eventoAtualizado, $inscrito));
                }
            }

            // Pra apagar as inscrições
            $evento->inscricoesEvento()->delete();

            $atividades = Atividade::query()->where('id_evento', $evento->id)->get();

            $evento->inscricoesEvento()->inscricoes()->delete();

            $evento->update($input);

            $evento->fresh();

        if (isset($input["banner_path"]) && $oldBanner && $oldBanner !== $input["banner_path"]) {
            S3Manager::delete($oldBanner);
        }

        return $evento->fresh();
    }

    private function validate(User $user, Evento $evento)
    {
        Gate::forUser($user)->authorize("update", $evento);
    }
}
