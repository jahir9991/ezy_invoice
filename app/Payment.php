<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected $fillable = [
        'invoice_id', 'invoice_number',
        'date', 'client_id', 'paid_price',
        'user_id'
    ];


    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }


}
