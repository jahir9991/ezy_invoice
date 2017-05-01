<?php

namespace App;


use Illuminate\Database\Eloquent\Model;

class Invoice_item extends Model
{
    protected $table = "invoice_items";

    protected $fillable = [
        'invoice_id', 'invoice_number',
        'product_id', 'product_quantity', 'product_rate', 'product_total_price'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }


}



