<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Supplier extends Model
{
    protected $fillable = [
        'name', 'address', 'phone',
        'email', 'user_id', 'status_id'
    ];
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $model->status_id = empty($model->status_id) ? 1 : $model->status_id;

        });
    }



    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }


}
