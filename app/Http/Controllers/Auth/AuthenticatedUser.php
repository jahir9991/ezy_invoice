<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
//use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthenticatedUser extends Controller
{
    public function index()
    {
        $token = JWTAuth::getToken();
        $user = JWTAuth::toUser($token);
        $user = User::with('role')->find($user->id);
        return $user;
//        return response()->json(compact('user'));

    }

}
