<?php

namespace App\Http\Controllers;

class OrganizacaoController extends Controller
{
    public function index()
    {
        return inertia('Manager/Organization/Index');
    }
}
