<?php

namespace App\Http\Controllers;

use App\Actions\Organizadores\DestroyOrganizadorAction;
use App\Actions\Organizadores\ListOrganizadoresAction;
use App\Http\Resources\Organizador\OrganizadorResource;
use Illuminate\Http\Request;

class OrganizadoresController
{
    public function destroy(int $id, DestroyOrganizadorAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return response()->noContent();
    }
}
