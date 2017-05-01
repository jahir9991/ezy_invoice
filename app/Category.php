<?php

namespace App;


use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $fillable = [
        'name', 'status_id', 'user_id'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $model->status_id = empty($model->status_id) ? 1 : $model->status_id;

        });
    }


    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
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




