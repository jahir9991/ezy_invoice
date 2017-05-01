<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;


    protected $fillable = [
        'name',
        'email', 'password',
        'phone',
        'designation', 'image',
        'role_id', 'status_id'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];


    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoices::class);
    }

    public function estimates()
    {
        return $this->hasMany(Estimate::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function payments()
    {
        return $this->hasMany(Voucher::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
    
    public function serviceCategories()
    {
        return $this->hasMany(ServiceCategory::class);
    }
    
}
