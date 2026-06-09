<?php

namespace App\Support;

use Illuminate\Support\Str;

final class URLValidator
{
    public static function isValidRedirect(?string $redirectTo): bool
    {
        if (blank($redirectTo)) {
            return false;
        }

        if (Str::startsWith($redirectTo, '/')) {
            return true;
        }

        $appUrl = parse_url(config('app.url'));
        $redirectUrl = parse_url($redirectTo);

        if (! $redirectUrl) {
            return false;
        }

        return ($redirectUrl['host'] ?? null) === ($appUrl['host'] ?? null)
            && ($redirectUrl['scheme'] ?? null) === ($appUrl['scheme'] ?? null);
    }
}
