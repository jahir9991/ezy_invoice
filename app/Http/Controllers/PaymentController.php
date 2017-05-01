<?php

namespace App\Http\Controllers;

use App\Invoice;
use App\Payment;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
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
            $invoice_number = $search['invoice_number'];
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

            $data = Payment::with('client')
                ->where("id", "LIKE", "%$id%")
                ->where("invoice_number", "LIKE", "%$invoice_number%")
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


    public function getPaymentsSearch_list(Request $request)
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
            $payment = Payment::create([
                'invoice_id' => $request->input('invoice_id'),
                'invoice_number' => $request->input('invoice_number'),
                'date' => $request->input('date'),
                'client_id' => $request->input('client_id'),
                'paid_price' => $request->input('paid_price'),
                'user_id' => 1
            ]);
            $invoice = Invoice::find($request->input('invoice_id'));
            $invoice->paid_price += $request->input('paid_price');
            $invoice->due_price = $invoice->total_price - $invoice->paid_price;

            if ($invoice->paid_price > 0 && $invoice->paid_price < $invoice->total_price) {
                $invoice->payment_status_id = 2;     /*partial paid*/
            } else if ($invoice->paid_price === $invoice->total_price) {
                $invoice->payment_status_id = 3;     /*full paid*/
            } else {
                $invoice->payment_status_id = 3;   /*unpaid*/
            }
            $invoice->save();

            $invoice = Invoice::with('invoice_products', 'paymentStatus', 'client')->find($invoice->id);
            DB::commit();
        } catch (\Exception $e) {
            return response()->json(array(
                'success' => false,
                'errors' => $e

            ), 400); // 400 being the HTTP code for an invalid request.


            DB::rollback();
        }
        return response()->json(['status' => 200, 'sms' => 'Successfully Added payment to Invoice ', 'invoice' => $invoice]);
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
