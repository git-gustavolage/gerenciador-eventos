<?php

namespace App\Validators;

use Carbon\Carbon;

class DateRangeValidator
{
    public function validate(Carbon $start, Carbon $end): bool
    {
        return $end->gt($start);
    }
}
