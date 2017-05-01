<?php

use App\PaymentStatus;
use App\User;
use App\Status;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('users')->delete();

        $users = array(
            ['name' => 'Ghost', 'phone' => '01553652775', 'role_id' => 3, 'status_id' => 1, 'email' => 'ghost@gmail.com', 'password' => Hash::make('ghost')],
            ['name' => 'Abedins', 'phone' => '01000000000', 'role_id' => 3, 'status_id' => 1, 'email' => 'abedins@gmail.com', 'password' => Hash::make('abedins')],

        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user) {
            User::create($user);
        }
        DB::table('statuses')->delete();

        $statuses = array(
            ['id' => 1, 'name' => 'Active'],
            ['id' => 2, 'name' => 'Inactive'],

        );

        // Loop through each user above and create the record for them in the database
        foreach ($statuses as $status) {
            Status::create($status);
        }
        DB::table('payment_statuses')->delete();

        $payment_statuses = array(
            ['id' => 1, 'name' => 'Unpaid'],
            ['id' => 2, 'name' => 'Partially Paid'],
            ['id' => 3, 'name' => 'Paid'],

        );

        // Loop through each user above and create the record for them in the database
        foreach ($payment_statuses as $payment_status) {
            PaymentStatus::create($payment_status);
        }

        Model::reguard();
    }
}
