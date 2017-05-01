<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Status extends Model
{

    protected $fillable = [
        'id', 'name'
    ];


    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Suppliers::class);
    }
    public function serviceCategories()
    {
        return $this->hasMany(ServiceCategory::class);
    }

}
