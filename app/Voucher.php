<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Voucher extends Model
{
    protected $fillable = [
        'number', 'date', 'supplier_id',
        'sub_total_price',
        'discount_price',
        'total_price',
        'paid_price',
        'due_price',
        'payment_status_id',
        'user_id'

    ];


    public function products()
    {

        return $this->belongsToMany(Product::class);

    }

    public function voucher_products()
    {
        return $this->hasMany(Voucher_item::class);
    }


    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }


}



