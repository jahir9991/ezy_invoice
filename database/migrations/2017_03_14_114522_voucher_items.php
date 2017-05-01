<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VoucherItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
        {
            Schema::create('voucher_items', function (Blueprint $table) {
                $table->increments('id');
               $table->integer('voucher_id');
                $table->string('voucher_number');
                $table->integer('product_id');
                $table->string('product_name');
                $table->integer('product_quantity');
               $table->double('product_rate',15,2);
               $table->double('product_total_price',15,2);

               $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('voucher_items');
    }
}
