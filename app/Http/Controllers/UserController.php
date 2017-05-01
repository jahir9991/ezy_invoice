<?php

namespace App\Http\Controllers;

use App\User;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function index()
    {

        // return response()->json(User::find(1)->isAdmin());

        //return User::with('role')->get();
        return User::all();

    }


    public function create()
    {
        return "create";
    }


    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'designation' => $request->input('designation'),
                'image' => $request->input('image'),
                'role_id' => 1,
             
            ]);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(['status' => 403, 'sms' => $e]);
            Db::rollBack();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Registered', 'user' => $user]);
        return "this is store method";

    }


    public function show($id)
    {
        return "show";
    }

    public function role($id)
    {
        return "role";
    }


    public function edit($id)
    {
        return "edit";

    }


    public function update(Request $request, $id)
    {
        return "update";
    }


    public function destroy($id)
    {
        return "delete";

    }


    public function singleUser($id)
    {
        return User::findOrFail($id);
    }




    public  function singleUserWithRole($id){
        return User::with('role')->findOrfail($id);
    }
}
