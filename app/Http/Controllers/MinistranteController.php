<?php

namespace App\Http\Controllers;

use App\Actions\Ministrante\DestroyMinistranteAction;
use App\Actions\Ministrante\StoreMinistranteAction;
use App\Http\Requests\Ministrante\StoreMinistranteRequest;

class MinistranteController extends Controller
{
    public function view()
    {
        //
    }

    public function index()
    {
        //
    }

    public function store(StoreMinistranteRequest $request, StoreMinistranteAction $action)
    {
        $action->execute(auth('web')->id(), $request->validated());

        return response()->json(['success' => true]);
    }

    public function update()
    {
        //
    }

    public function destroy(int $id, DestroyMinistranteAction $action)
    {
        $action->execute(auth('web')->id(), $id);

        return response()->noContent();
    }
}
