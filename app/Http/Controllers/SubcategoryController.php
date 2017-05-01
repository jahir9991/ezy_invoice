<?php

namespace App\Http\Controllers;

use App\Category;
use DB;
use App\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class SubcategoryController extends Controller
{

    public function index(Request $request)
    {
//        return $request->input();
        return Subcategory::with('status')->get();
    }

    public function scopeSearchByKeyword($pagination, $search, $sort)
    {
        try {
            $id = $search['id'];
            $name = $search['name'];
            $category = $search['category'];
            $status = $search['status'];
            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];
            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Subcategory::with('status', 'category')
                ->where("id", "LIKE", "%$id%")
                ->where("name", "LIKE", "%$name%")
                ->where("category_id", "LIKE", ($category == null ? "%%" : "$category"))
                ->where("status_id", "LIKE", ($status == null ? "%%" : "$status"))
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


    public function getSubcategoriesSearch(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Subcategory::with('status')->paginate($pagination['per_page']);
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
            'name' => 'required|unique:subcategories',
            'category_id' => 'required'
        ];
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->getMessageBag()->toArray()

            ], 400);
        }


        try {
            DB::beginTransaction();
            $subcategory = Subcategory::create([
                'name' => $request->input('name'),
                'category_id' => $request->input('category_id'),
                'status_id' => $request->input('status_id'),
                'user_id' => 1

            ]);
            $subcategory = Subcategory::with('status', 'category')->find($subcategory->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => ['something went wrong']

            ), 400);

            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Subcategory ', 'subcategory' => $subcategory]);
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

            $subcategory = Subcategory::find($id);

            if ($subcategory) {
                $subcategory->$key = $newData;
                $subcategory->save();
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
            if (Subcategory::find($id) !== null) {
                Subcategory::find($id)->delete();
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
    public function singleSubcategory($id)
    {
        return Subcategory::findOrFail($id);
    }


    public function singleSubcategoryWithProducts($id)
    {
        return Subcategory::with('products')->findOrfail($id);
    }


    public function singleSubcategoryWithCategory($id)
    {
        return Subcategory::with('category')->findOrfail($id);
    }


}
