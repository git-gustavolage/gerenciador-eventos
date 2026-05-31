<?php

namespace App\Validators;

use Carbon\Carbon;

class ScheduleConflictValidator
{
    public function validate(Carbon $start, Carbon $end, iterable $intervals): bool
    {
        foreach ($intervals as $interval) {
            if ($start->lt($interval["end"]) && $end->gt($interval["start"])) {
                return false;
            }
        }

        return true;
    }
}
