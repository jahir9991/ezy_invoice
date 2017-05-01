<?php

namespace App;


use Illuminate\Database\Eloquent\Model;

class Voucher_item extends Model
{
    protected $table = "voucher_items";

    protected $fillable = [
        'voucher_id', 'voucher_number',
        'product_id','product_name', 'product_quantity', 'product_rate', 'product_total_price'
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }


}



