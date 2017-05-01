<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Client extends Model
{


    protected
        $fillable = [
        'name', 'address', 'phone',
        'email', 'image', 'user_id', 'status_id'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $model->status_id = empty($model->status_id) ? 1 : $model->status_id;
        

        });
    }


    public
    function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public
    function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public
    function status()
    {
        return $this->belongsTo(Status::class);
    }

}
