<?php

namespace App\Http\Controllers;

use App\Service;
use App\ServiceCategory;
use DB;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;


class ServiceCategoryController extends Controller
{

    public function index(Request $request)
    {
//        return $request->input();
        return ServiceCategory::with('status')->get();
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
            $status = $search['status'];
            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];

            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = ServiceCategory::with('status')
                ->where("id", "LIKE", "%$id%")
                ->where("name", "LIKE", "%$name%")
                ->where("status_id", "LIKE", "%$status%")
                ->orderBy($key, $order)
                ->paginate($per_page);
            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response($data);


//        return false;
    }


    public function getCategoriesSearch(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return ServiceCategory::with('status')->paginate($pagination['per_page']);
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
            'name' => 'required|unique:categories'
        ];
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return response()->json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()->toArray()

            ), 400);
        }


        try {
            DB::beginTransaction();
            $category = ServiceCategory::create([
                'name' => $request->input('name'),
                'status_id' => $request->input('status_id'),
                'user_id' => 1

            ]);
            $category = ServiceCategory::with('status')->find($category->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => ['something went wrong']

            ), 400); // 400 being the HTTP code for an invalid request.


            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Category ', 'category' => $category]);
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

            $category = ServiceCategory::find($id);

            if ($category) {
                $category->$key = $newData;
                $category->save();
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
            if (ServiceCategory::find($id) !== null) {
                ServiceCategory::find($id)->delete();
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

    //CUSTOMIZE CONTROLLER
    public function singleCategory($id)
    {
        try {
            return ServiceCategory::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 404, 'sms' => "DATA COULD NOT FOUND"]);
        }

    }
}
