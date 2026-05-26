<?php

namespace App\Http\Controllers;

class ManagerController extends Controller
{
    public function view()
    {
        return inertia("Manager/Index");
    }

    public function general()
    {
        return inertia("Manager/General/Index");
    }
}
