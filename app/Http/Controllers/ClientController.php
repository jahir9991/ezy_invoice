<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Client;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{

    public function index(Request $request)
    {
//        return $request->input();
        return Client::with('status')->get();
    }

    /**
     * @param $pagination
     * @param $search
     * @param $sort
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function scopeSearchByKeyword($pagination, $search, $sort)
    {


        try {
            $id = $search['id'];
            $name = $search['name'];
            $address = $search['address'];
            $email = $search['email'];
            $phone = $search['phone'];

            $status = $search['status'];
            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];

            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Client::with('status')
                ->where("id", "LIKE", "%$id%")
                ->where("name", "LIKE", "%$name%")
                ->where(($address == null ? "id" : "address"), ($address == null ? ">" : "LIKE"), ($address == null ? "0" : "%$address%"))
                ->where(($email == null ? "id" : "email"), ($email == null ? ">" : "LIKE"), ($email == null ? "0" : "%$email%"))
                ->where("phone", "LIKE", "%$phone%")
                ->where("status_id", "LIKE", "%$status%")
                ->orderBy($key, $order)
                ->paginate($per_page);
            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response($data);

    }


    public function getClientsSearch_list(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Client::with('status')->paginate($pagination['per_page']);
    }

    public function getClientsSearch(Request $request)  //name or phone or id
    {
//        return  $request->input('searchTerm');
        $searchTerm = $request->input('searchTerm');

        return response()->json(Client::
        where('name', 'LIKE', "%$searchTerm%")
            ->orWhere('phone', 'LIKE', "%$searchTerm%")
            ->orWhere('id', 'LIKE', "%$searchTerm%")
            ->get());


    }


    public function create()
    {
        //
    }


    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required',
            'email' => 'unique:clients',
            'phone' => 'required|unique:clients'

        ];
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return response()->json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()

            ), 400); // 400 being the HTTP code for an invalid request.
        }


        try {
            DB::beginTransaction();
            $client = Client::create([
                'name' => $request->input('name'),
                'address' => $request->input('address'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'image' => $request->input('image'),
                'status_id' => $request->input('status_id'),
                'user_id' => 1

            ]);
            $client = Client::with('status')->find($client->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => ['something went wrong']

            ), 400); // 400 being the HTTP code for an invalid request.

            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Client ', 'client' => $client]);
    }


    public function show($id)
    {
        //
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        $data = $request->input('data');
        $newData = $data['newData'];
        $key = $data['key'];

        try {
            DB::beginTransaction();

            $client = Client::find($id);

            if ($client) {
                $client->$key = $newData;
                $client->save();
            } else {
                throw new Exception();
            }

            DB::commit();
        } catch (\Exception $e) {

            $error = $e->getCode() === '23000' ? 'Already exist, try another' : 'Something went wrong';

            return response()->json($error, 403);
            Db::rollBack();
        }
        return response()->json(['sms' => 'Your information has been updated successfully!', 'status' => 200]);


    }


    /**
     * @param $id
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {

        try {
            DB::beginTransaction();
            if (Client::find($id) !== null) {
                Client::find($id)->delete();
            } else {
                throw new Exception();
            }

            DB::commit();
        } catch (\Exception $e) {

            return response()->json('Something went wrong', 403);
            Db::rollBack();
        }
        return response()->json(['sms' => 'Your information has been deleted successfully!', 'status' => 200]);


    }

    //CUSTOMIZE FUNCTION
    public function singleClient($id)
    {
        return Client::findOrFail($id);
    }

    public function singleClientWithInvoices($id)
    {
        return Client::with('invoices')->findOrfail($id);
    }

}
