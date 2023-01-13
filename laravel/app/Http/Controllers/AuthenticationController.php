<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class AuthenticationController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    
    public function doLogin()
    {
        return "hello login";
    }

    public function doSignup()
    {
        return "hello signup";
    }
    
    public function doForgot()
    {
        return "hello forgot";
    }
}
