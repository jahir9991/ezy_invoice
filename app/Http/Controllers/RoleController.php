<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        return Role::all();
    }

   
    public function create()
    {
        //
    }


    public function store(Request $request)
    {

        try {
            DB::beginTransaction();
            $role = Role::create([
                'name' => $request->input('name')
            ]);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(['status' => 403, 'sms' => $e]);
            Db::rollBack();
        }
        return response()->json(['status' => 200, 'sms' => 'successfully Stored', 'role' => $role]);


    }


    public function show($id)
    {
        return Role::findOrFail($id);
    }


    public function update(Request $request, $id)
    {
        return "update";
    }


    public function destroy($id)
    {
        //
    }


    public function singleRole($id)
    {
        return Role::findOrFail($id);
    }
    public function singleRoleWithUsers($id)
    {
        return Role::findOrfail($id)->with('users')->get();
    }
}
