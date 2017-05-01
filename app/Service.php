<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Service extends Model
{
    protected $fillable = [
        'name', 'selling_price', 'service_category_id',
        'status_id', 'user_id'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $model->status_id = empty($model->status_id) ? 1 : $model->status_id;

        });
    }


    public function category()
    {
        return $this->belongsTo(ServiceCategory::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function estimateItems()
    {
        return $this->hasMany(EstimateItem::class);
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



