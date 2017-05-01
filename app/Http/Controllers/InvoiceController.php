<?php

namespace App\Http\Controllers;

use App\Invoice_item;
use App\Product;
use Illuminate\Http\Request;
use App\Invoice;
use DB;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
//        return $request->input();
        return Invoice::with('paymentStatus', 'client', 'createdBy')->get();
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
            $client_id = $search['client_id'];
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

            $data = Invoice::with('paymentStatus', 'client', 'invoice_products')
                ->where("id", "LIKE", "%$id%")
                ->where("number", "LIKE", "%$number%")
                ->where("date", "LIKE", "%$date%")
                ->where("client_id", "LIKE", "%$client_id%")
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


    public function getInvoicesSearch_list(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);

        return [$pagination['per_page'], $search, $sort];
        return Invoice::with('status')->paginate($pagination['per_page']);
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
            'client_id' => 'required',
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
            $invoice = Invoice::create([
                'number' => strtotime($request->input('date')) . mt_rand(100000, 999999),
                'date' => $request->input('date'),
                'client_id' => $request->input('client_id'),
                'sub_total_price' => $request->input('sub_total_price'),
                'discount_price' => $request->input('discount_price'),
                'total_price' => $request->input('total_price'),
                'paid_price' => 0,
                'due_price' => $request->input('total_price'),
                'payment_status_id' => 1,
                'locked_status' => 1,

                'user_id' => 1

            ]);

            $data = [];
            foreach ($request->input('items') as $val) {
                $item = array(
                    'invoice_id' => $invoice['id'],
                    'invoice_number' => $invoice['number'],
                    'product_id' => $val['product_id'],
                    'product_name' => $val['product_name'],
                    'product_quantity' => $val['product_quantity'],
                    'product_rate' => $val['product_rate'],
                    'product_total_price' => $val['product_quantity'] * $val['product_rate']
                );
                $data[] = $item;
                $p = Product::find($val['product_id']);

                if ($p) {
                    if ($p->quantity >= $val['product_quantity']) {
                        $p->quantity -= $val['product_quantity'];
                        $p->save();
                    } else {
                        throw new Exception();
                    }

                } else {
                    throw new Exception();
                }
            }
            $invoiceProducts = Invoice_item::insert($data);
            $invoice = Invoice::with('invoice_products', 'paymentStatus', 'client')->find($invoice->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => $e

            ), 400); // 400 being the HTTP code for an invalid request.


            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added New Invoice ', 'invoice' => $invoice]);
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

            $invoice = Invoice::find($id);

            if ($invoice) {
                $invoice->$key = $newData;
                $invoice->save();
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
            if (Invoice::find($id) !== null) {
                Invoice::find($id)->delete();
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


    public function stores(Request $request)
    {
        try {
            DB::beginTransaction();
            $invoice = Invoice::create([
                'date' => $request->input('date'),
                'client_id' => $request->input('client_id'),
                'user_id' => $request->input('user_id'),
                'total' => $request->input('total'),
                'paid' => $request->input('paid'),
                'due' => $request->input('due')
            ]);
            $data = [];
            foreach ($request->input('products') as $val) {
                $item = array(
                    'invoice_id' => $invoice['id'],
                    'product_id' => $val['id'],
                    'product_quantity' => $val['quantity'],
                    'unit' => $val['unit'],
                    'sub_total' => $val['sub_total']
                );
                $data[] = $item;
            }
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(['status' => 403, 'sms' => $e]);
            Db::rollBack();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Created', 'invoice' => $invoice]);

    }


}
