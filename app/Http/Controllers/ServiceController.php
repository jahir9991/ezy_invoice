<?php

namespace App\Http\Controllers;

use App\Subcategory;
use App\Service;
use App\Vendor;
//use Laravel\Scout\Searchable;
use Illuminate\Http\Response;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use League\Flysystem\Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class ServiceController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Service::all());

        return Service::with('status', 'subcategory.category')->paginate($request->input('per_page'));
    }

    public function scopeSearchByKeyword($pagination, $search, $sort)
    {

        try {
            $id = $search['id'];
            $name = $search['name'];
            $selling_price = $search['selling_price'];
            $type = $search['type'];
            $status = $search['status'];
            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];
            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Service::with('status', 'subcategory')
                ->where("id", "LIKE", "%$id%")
                ->where("name", "LIKE", "%$name%")
                ->where(($selling_price == null ? "id" : "selling_price"), ($selling_price == null ? ">" : "LIKE"), ($selling_price == null ? "0" : "%$selling_price%"))
                ->where(($type == null ? "id" : "type"), ($type== null ? ">" : "LIKE"), ($type== null ? "0" : "%$type%"))
                ->where("status_id", "LIKE", ($status == null ? "%%" : "$status"))
                ->orderBy($key, $order)
                ->paginate($per_page);

            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response($data);


    }


    public function getServicesSearch_list(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Service::with('status')->paginate($pagination['per_page']);
    }

    public function getServicesBySearch_sell(Request $request)
    {

        try {
            $searchTerm = $request->input('searchTerm');
            DB::beginTransaction();

            $data = Service::where("quantity", ">", "0")
                ->whereNotNull("selling_price")
                ->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('brand', 'LIKE', "%$searchTerm%")
                        ->orWhere('id', 'LIKE', "%$searchTerm%");
                })
                ->get();


            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response()->json($data);

    }

    public function getServicesBySearch_buy(Request $request)
    {

        try {
            $searchTerm = $request->input('searchTerm');
            DB::beginTransaction();

            $data = Service::where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%$searchTerm%")
                    ->orWhere('id', 'LIKE', "%$searchTerm%");
            })
                ->get();


            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response()->json($data);

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
            'name' => 'required|unique:services',
            'selling_price' => 'required',

        ];
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return response()->json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()->toArray()

            ), 400); // 400 being the HTTP code for an invalid request.
        }

        try {

            DB::beginTransaction();
            $service = Service::create([
                'name' => $request->input('name'),
                'selling_price' => $request->input('selling_price'),
                'type' => $request->input('type'),



                'status_id' => $request->input('status_id'),
                'user_id' => 1

            ]);
            $service = Service::with('status', 'subcategory.category')->find($service->id);
            DB::commit();
        } catch (\Exception $e) {

            return response()->json(array(
                'success' => false,
                'errors' => ['something went wrong']

            ), 400); // 400 being the HTTP code for an invalid request.

            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Service ', 'service' => $service]);
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

            $service = Service::find($id);

            if ($service) {
                $service->$key = $newData;
                $service->save();
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
            if (Service::find($id) !== null) {
                Service::find($id)->delete();
            } else {
                throw new Exception();
            }

            DB::commit();
        } catch (\Exception $e) {

            $error = $e->getCode() === '23000' ? 'Already exist, try another' : 'Something went wrong';

            return response()->json($error, 403);
            Db::rollBack();
        }
        return response()->json(['sms' => 'Your information has been deleted successfully!', 'status' => 200]);


    }


    //Customize Service controller
    public function singleService($id)
    {
        try {
            $service = Service::findOrfail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 404, 'sms' => 'DATA COULD NOT FOUND']);
        }

//     $service= Service::find($id)->quantity;
        return $service;
    }

    public function singleServiceWithSubcategory($id)
    {
        return Service::with('subcategory')->find($id);
    }

    public function singleServiceWithSubcategoryWithCategory($id)
    {
        return Service::with('subcategory.category')->find($id);
    }

    public function singleServiceWithVendor($id)
    {
        return Service::with('vendor')->findOrFail($id);
    }

}
