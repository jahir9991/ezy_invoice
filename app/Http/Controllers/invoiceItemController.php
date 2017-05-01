<?php

namespace App\Http\Controllers;
use App\InvoiceItem;
use App\Product;
use DB;
use Illuminate\Http\Request;



class invoiceItemController extends Controller
{

    public function index()
    {
       return InvoiceItem::all();
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        
        try {
                DB::beginTransaction();
                $invoiceItem =InvoiceItem::create([
               'invoice_id' => $request->input('invoice_id'),
               'product_id' => $request->input('product_id'),
               'quantity' => $request->input('quantity'),
               'unit' => $request->input('unit'),
               'sub_total' => $request->input('sub_total')
               ]);
                $quantity=  Product::findOrFail($request->product_id)->quantity;
               if ($quantity< $request->quantity){
                  return "NOT AVAIlABLE";
               }
               else
               {
                   return $quantity-$request->quantity;
               }
               DB::commit();
           } catch (\Exception $e) {
               return response()->json(['status' => 403, 'sms' => $e]);
               Db::rollBack();
          }



    }


    public function show($id)
    {
        return "this is show";
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }

    
    public function destroy($id)
    {
        //
    }

    public  function  singleInvoiceItem($id)
    {
//           return $id;
           return InvoiceItem::findOrFail($id);
    }


    public function singleInvoiceItemWithInvoice($id)
    {
        return InvoiceItem::findOrFail($id)->with('invoices')->get();
    }

    public function singleInvoiceItemWithProducts($id)
    {
        return InvoiceItem::with('products')->get();
    }
    
}
