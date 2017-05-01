<?php

namespace App\Http\Controllers;

use App\Voucher_item;
use App\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Voucher;
use DB;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
//        return $request->input();
        return Voucher::with('paymentStatus', 'supplier', 'createdBy')->get();
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
            $number = $search['number'];

            $date = $search['date'];
            $supplier_id = $search['supplier_id'];
            $total_price = $search['total_price'];
            $paid_price = $search['paid_price'];
            $due_price = $search['due_price'];
            $payment_status_id = $search['payment_status_id'];

            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];

            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Voucher::with('paymentStatus', 'supplier', 'voucher_products')
                ->where("id", "LIKE", "%$id%")
                ->where("number", "LIKE", "%$number%")
                ->where("date", "LIKE", "%$date%")
                ->where("supplier_id", "LIKE", "%$supplier_id%")
                ->where("total_price", "LIKE", "%$total_price%")
                ->where("paid_price", 'LIKE', "%$paid_price%")
                ->where("due_price", "LIKE", "%$due_price%")
                ->where("payment_status_id", "LIKE", "%$payment_status_id%")
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


    public function getVouchersSearch_list(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Voucher::with('status')->paginate($pagination['per_page']);
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
            'supplier_id' => 'required',
            'date' => 'required',
            'sub_total_price' => 'required',
            'discount_price' => 'required',
            'total_price' => 'required',
        ];
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return response()->json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()

            ), 403); // 400 being the HTTP code for an invalid request.
        }


        try {
            DB::beginTransaction();
            $voucher = Voucher::create([
                'number' => strtotime(Carbon::now()) . mt_rand(100000, 999999),
                'date' => $request->input('date'),
                'supplier_id' => $request->input('supplier_id'),
                'sub_total_price' => $request->input('sub_total_price'),
                'discount_price' => $request->input('discount_price'),
                'total_price' => $request->input('total_price'),
                'paid_price' => 0,
                'due_price' => $request->input('total_price'),
                'payment_status_id' => 1,

                'user_id' => 1

            ]);

            $data = [];
            foreach ($request->input('items') as $val) {
                $item = array(
                    'voucher_id' => $voucher['id'],
                    'voucher_number' => $voucher['number'],
                    'product_id' => $val['product_id'],
                    'product_name' => $val['product_name'],
                    'product_quantity' => $val['product_quantity'],
                    'product_rate' => $val['product_rate'],
                    'product_total_price' => $val['product_quantity'] * $val['product_rate']
                );
                $data[] = $item;
                $p = Product::find($val['product_id']);

                if ($p) {
                    $p->quantity += $val['product_quantity'];
                    $p->buying_price = $val['product_rate'];

                    $p->save();


                } else {
                    throw new Exception();
                }
            }
            $voucherProducts = Voucher_item::insert($data);
            $voucher = Voucher::with('voucher_products', 'paymentStatus', 'supplier')->find($voucher->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => $e

            ), 400); // 400 being the HTTP code for an invalid request.


            DB::rollback();
        }

        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Voucher ', 'voucher' => $voucher]);
    }


    public
    function show($id)
    {
        //
    }


    public
    function edit($id)
    {
        //
    }


    public
    function update(Request $request, $id)
    {
        $data = $request->input('data');
        $newData = $data['newData'];
        $key = $data['key'];

        try {
            DB::beginTransaction();

            $voucher = Voucher::find($id);

            if ($voucher) {
                $voucher->$key = $newData;
                $voucher->save();
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
    public
    function destroy($id)
    {

        try {
            DB::beginTransaction();
            if (Voucher::find($id) !== null) {
                Voucher::find($id)->delete();
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


}
