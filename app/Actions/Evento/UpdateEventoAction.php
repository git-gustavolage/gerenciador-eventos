<?php

namespace App\Actions\Evento;

use App\Enum\StoragePathEnum;
use App\Exceptions\UpdateFailedException;
use App\Models\Evento;
use App\Support\S3Manager;
use App\Support\StoreImage;
use Exception;

class UpdateEventoAction
{
    public function execute(int $evento_id, array $input): Evento
    {
        $evento = Evento::query()->findOrFail($evento_id);

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

        $evento->update($input);

        if (isset($input["banner_path"]) && $oldBanner && $oldBanner !== $input["banner_path"]) {
            S3Manager::delete($oldBanner);
        }

        return $evento->fresh();
    }
}
