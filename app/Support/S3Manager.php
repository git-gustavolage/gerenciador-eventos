<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class S3Manager
{
    /**
     * Executa a consulta da midia dentro do servidor
     * armazena o arquivo temporariamente e retorna o arquivo
     *
     * @param  string  $path  o caminho da midia dentro do servidor
     * @param  string  $filename  o nome do arquivo a ser retornado
     */
    public static function get(string $path, string $filename = "download"): ?StreamedResponse
    {
        $disk = Storage::disk("local");

        if (!$disk->exists($path)) {
            return null;
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        $contentType = match ($ext) {
            "jpg", "jpeg" => "image/jpeg",
            "png" => "image/png",
            "webp" => "image/webp",
            "gif" => "image/gif",
            "pdf" => "application/pdf",
            "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "csv" => "text/csv",
            default => "application/octet-stream",
        };

        $disposition = $ext === "pdf" ? "inline" : "attachment";

        $lastModified = $disk->lastModified($path);

        $asciiFilename = Str::ascii($filename);

        $utf8Filename = rawurlencode($filename);

        $contentDisposition = $disposition . '; filename="' . $asciiFilename . '"' . "; filename*=UTF-8''" . $utf8Filename;

        return $disk->response($path, $filename, [
            "Content-Type" => $contentType,
            "Content-Disposition" => $contentDisposition,

            "Cache-Control" => "public, max-age=31536000, immutable",
            "Expires" => gmdate("D, d M Y H:i:s", strtotime("+1 year")) . " GMT",
            "Last-Modified" => gmdate("D, d M Y H:i:s", $lastModified) . " GMT",

            "Accept-Ranges" => "bytes",

            "X-Content-Type-Options" => "nosniff",
        ]);
    }

    public static function temporaryUrl(?string $path)
    {
        if (!$path) {
            return null;
        }

        return Storage::disk("local")->temporaryUrl($path, now()->addHour());
    }

    public static function delete(string $path)
    {
        return Storage::disk("local")->delete($path);
    }
}
