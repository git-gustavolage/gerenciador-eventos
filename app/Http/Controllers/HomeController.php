<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function view()
    {
        return inertia("Home/Index");
    }
}
