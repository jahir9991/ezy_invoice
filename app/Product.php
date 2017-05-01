<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Product extends Model
{
    protected $fillable = [
        'name', 'brand',
        'buying_price', 'selling_price', 'quantity',
        'subcategory_id',
        'image',
        'status_id', 'user_id'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $model->status_id = empty($model->status_id) ? 1 : $model->status_id;

        });
    }



    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function  invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
    public function  estimateItems()
    {
        return $this->hasMany(EstimateItem::class);
    }
    public function  voucherItem()
    {
        return $this->hasMany(VoucherItem::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }


}



