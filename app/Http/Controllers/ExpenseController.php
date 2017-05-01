<?php

namespace App\Http\Controllers;

use App\Voucher;
use App\Expense;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }


    public function scopeSearchByKeyword($pagination, $search, $sort)
    {


        try {
            $id = $search['id'];
            $voucher_number = $search['voucher_number'];
            $date = $search['date'];
            $paid_price = $search['paid_price'];


            $per_page = $pagination['per_page'];
            $page = $pagination['page'];

            $key = $sort['key'];
            $order = $sort['order'];

            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });

            DB::beginTransaction();

            $data = Expense::with('supplier')
                ->where("id", "LIKE", "%$id%")
                ->where("voucher_number", "LIKE", "%$voucher_number%")
                ->where("date", "LIKE", "%$date%")
                ->where("paid_price", "LIKE", "%$paid_price%")
                ->orderBy($key, $order)
                ->paginate($per_page);
            DB::commit();
        } catch (\Exception $e) {
            return response($e, 403);
            Db::rollBack();
        }

        return response($data);

    }


    public function getExpensesSearch_list(Request $request)
    {
        $pagination = $request->input('pagination');
        $search = $request->input('search');
        $sort = $request->input('sort');

        return $this->scopeSearchByKeyword($pagination, $search, $sort);


    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $expense = Expense::create([
                'voucher_id' => $request->input('voucher_id'),
                'voucher_number' => $request->input('voucher_number'),
                'date' => $request->input('date'),
                'supplier_id' => $request->input('supplier_id'),
                'paid_price' => $request->input('paid_price'),
                'user_id' => 1
            ]);
            $voucher = Voucher::find($request->input('voucher_id'));
            $voucher->paid_price += $request->input('paid_price');
            $voucher->due_price = $voucher->total_price - $voucher->paid_price;

            if ($voucher->paid_price > 0 && $voucher->paid_price < $voucher->total_price) {
                $voucher->payment_status_id = 2;     /*partial paid*/
            } else if ($voucher->paid_price === $voucher->total_price) {
                $voucher->payment_status_id = 3;     /*full paid*/
            } else {
                $voucher->payment_status_id = 3;   /*unpaid*/
            }
            $voucher->save();

            $voucher = Voucher::with('voucher_products', 'paymentStatus', 'supplier')->find($voucher->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => $e

            ), 400); // 400 being the HTTP code for an invalid request.


            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added expense to Voucher ', 'voucher' => $voucher]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
