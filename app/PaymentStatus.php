<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class PaymentStatus extends Model
{
    protected $fillable = [
        'id','name',

    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }






}



