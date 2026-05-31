<?php

namespace App\Support;

use App\Exceptions\ApplicationException;
use App\Exceptions\InvalidFileException;
use App\Exceptions\UnsupportedFileTypeException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreImage
{
    private const ALLOWED_MIMES = ["image/jpeg", "image/png", "application/pdf"];

    private const MAP_MIME_EXTENSIONS = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "application/pdf" => "pdf",
    ];

    private const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

    public static function save(string $path, UploadedFile $file): string
    {
        if (!($file instanceof UploadedFile)) {
            throw new InvalidFileException();
        }

        $mime = self::getFileMime($file);

        self::validate($file, $mime);

        $fileContent = file_get_contents($file->getRealPath());
        $ext = self::MAP_MIME_EXTENSIONS[$mime];

        $path = rtrim($path, "/") . "/";
        $uniqueId = Str::uuid()->toString();
        $contentHash = substr(hash("sha256", $fileContent), 0, 12);
        $finalPath = $path . $uniqueId . "_" . $contentHash . "." . $ext;

        $success = false;

        try {
            $success = Storage::disk("local")->put($finalPath, $fileContent, [
                "ContentType" => $mime,
                "ContentDisposition" => "attachment",
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao salvar arquivo no S3", [
                "error" => $e->getMessage(),
                "path" => $finalPath,
                "mime" => $mime,
            ]);
        }

        if (!$success) {
            throw new ApplicationException("Não foi possível salvar o arquivo no momento.", [
                "path" => $finalPath,
                "mime" => $mime,
            ]);
        }

        return $finalPath;
    }

    private static function validate(UploadedFile $file, string $mime): void
    {
        if (!in_array($mime, self::ALLOWED_MIMES)) {
            throw new UnsupportedFileTypeException(
                "Formato de arquivo não suportado. Envie apenas imagens JPG, PNG ou arquivos PDF.",
            );
        }

        if ($file->getSize() > self::MAX_FILE_SIZE) {
            throw new InvalidFileException("O arquivo excede o tamanho máximo permitido.");
        }

        if (str_starts_with($mime, "image/")) {
            $imageInfo = getimagesize($file->getRealPath());

            if ($imageInfo === false) {
                throw new InvalidFileException("A imagem enviada é inválida.");
            }

            [$width, $height] = $imageInfo;

            if ($width > 10000 || $height > 10000) {
                throw new InvalidFileException("A imagem excede as dimensões máximas permitidas.");
            }
        }
    }

    private static function getFileMime(UploadedFile $file): string
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);

        $mime = $finfo->file($file->getRealPath());

        if ($mime === false) {
            throw new InvalidFileException("Não foi possível identificar o tipo do arquivo.");
        }

        return $mime;
    }
}
