<?php

namespace App\Http\Controllers;

use App\Subcategory;
use App\PaymentStatus;
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

class PaymentStatusController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(PaymentStatus::all());


    }

    public function scopeSearchByKeyword($pagination, $search, $sort)
    {
//        return $search;
        try {
            $id = $search['id'];
            $name = $search['name'];
            $brand = $search['brand'];
            $quantity = $search['quantity'] || "";
            $buying_price = $search['buying_price'];
            $selling_price = $search['selling_price'];
            $subcategory = $search['subcategory'];
            $status = $search['status'];
            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];
            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Product::with('status', 'subcategory')
                ->where("id", "LIKE", "%$id%")
                ->where("name", "LIKE", "%$name%")
                ->where(($brand == null ? "id" : "brand"), ($brand == null ? ">" : "LIKE"), ($brand == null ? "0" : "%$brand%"))
                ->where(($quantity == null ? "id" : "quantity"), ($quantity == null ? ">" : "LIKE"), ($quantity == null ? "0" : "%$quantity%"))
                ->where(($buying_price == null ? "id" : "buying_price"), ($buying_price == null ? ">" : "LIKE"), ($buying_price == null ? "0" : "%$buying_price%"))
                ->where(($selling_price == null ? "id" : "selling_price"), ($selling_price == null ? ">" : "LIKE"), ($selling_price == null ? "0" : "%$selling_price%"))
                ->where("subcategory_id", "LIKE", "%$subcategory%")
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


    public function getProductsSearch(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Product::with('status')->paginate($pagination['per_page']);
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
            'name' => 'required|unique:products',
            'subcategory_id' => 'required'
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
            $product = Product::create([
                'name' => $request->input('name'),
                'brand' => $request->input('brand'),

                'subcategory_id' => $request->input('subcategory_id'),
                'image' => $request->input('image'),

                'status_id' => $request->input('status_id'),
                'user_id' => 1

            ]);
            $product = Product::with('status', 'subcategory.category')->find($product->id);
            DB::commit();
        } catch (\Exception $e) {

            return response()->json(array(
                'success' => false,
                'errors' => ['something went wrong']

            ), 400); // 400 being the HTTP code for an invalid request.

            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Product ', 'product' => $product]);
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

            $product = Product::find($id);

            if ($product) {
                $product->$key = $newData;
                $product->save();
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
            if (Product::find($id) !== null) {
                Product::find($id)->delete();
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


    //Customize Product controller
    public function singleProduct($id)
    {
        try {
            return $product = Product::findOrfail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 404, 'sms' => 'DATA COULD NOT FOUND']);
        }

//     $product= Product::find($id)->quantity;
//      return  $result=$product-5;
    }

    public function singleProductWithSubcategory($id)
    {
        return Product::with('subcategory')->find($id);
    }

    public function singleProductWithSubcategoryWithCategory($id)
    {
        return Product::with('subcategory.category')->find($id);
    }

    public function singleProductWithVendor($id)
    {
        return Product::with('vendor')->findOrFail($id);
    }

}
