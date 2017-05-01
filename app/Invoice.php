<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Invoice extends Model
{
    protected $fillable = [
        'number', 'date', 'client_id',
        'sub_total_price', 'discount_price',
        'total_price', 'paid_price', 'due_price',
        'payment_status_id', 'locked_status',
        'user_id'
    ];

    public function products()
    {

        return $this->belongsToMany(Product::class);

    }

    public function services()
    {
        return $this->belongsToMany(Service::class);
    }

    public function invoice_products()
    {
        return $this->hasMany(Invoice_item::class);
    }
    
    public function client()
    {
        return $this->belongsTo(Client::class);
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



