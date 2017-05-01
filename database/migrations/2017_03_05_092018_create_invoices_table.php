<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->string('number')->unique();
            $table->date('date');
            $table->integer('client_id');

            $table->double('sub_total_price',15,2);
            $table->double('discount_price',15,2);
            $table->double('total_price',15,2);
            $table->double('paid_price',15,2);
            $table->double('due_price',15,2);

            $table->tinyInteger('payment_status_id');
            $table->tinyInteger('locked_status');
            $table->integer('user_id');
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
        Schema::dropIfExists('invoices');
    }
}
