<?php


Route::get('/', function () {
    return File::get(public_path() . '/start.html');
});


