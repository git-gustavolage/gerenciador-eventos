<?php

namespace App\Validators;

use Carbon\Carbon;

class PeriodContainmentValidator
{
    public function validate(Carbon $parentStart, Carbon $parentEnd, Carbon $childStart, Carbon $childEnd): bool
    {
        return $childStart->gte($parentStart) && $childEnd->lte($parentEnd);
    }
}
