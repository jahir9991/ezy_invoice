<?php


use Illuminate\Http\Request;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:api');

/*login through api/login      */
Route::post('login', 'Auth\LoginController@login');

/*registration  through api/register */
Route::resource('register', 'Auth\RegisterController', ['only' => ['store']]);
//Route::post('register', 'Auth\RegisterController@register');


Route::group(['middleware' => 'jwt.auth',  /*  'middleware' => 'throttle:20' */], function () {


    /*************** Authentication api *******************************/

    /**
     * get user info from given token  */
    Route::resource('authenticateduser', 'Auth\AuthenticatedUser');
    /****/

    /**
     ** get user logged out     */
    Route::get('logout', 'Auth\LoginController@logout');
    /**
     */

});


//Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
//Route::post('authenticate', 'AuthenticateController@authenticate');

Route::resource('statuses', 'StatusController');
Route::resource('paymentstatuses', 'PaymentStatusController');
Route::resource('roles', 'RoleController');
//Route::resource('users', 'UserController');


/*-------------------------------------------payments-------------------------------------------*/
/**/
Route::resource('payments/get_payments_search_list', 'PaymentController@getPaymentsSearch_list');
Route::resource('payments', 'PaymentController');
/*----------------------------------------------------------------------------------------------*/


/*-------------------------------------------expenses-------------------------------------------*/
/**/
Route::resource('expenses/get_expenses_search_list', 'ExpenseController@getExpensesSearch_list');
Route::resource('expenses', 'ExpenseController');
/*----------------------------------------------------------------------------------------------*/


/*-------------------------------------------suppliers-------------------------------------------*/
/**/
Route::post('suppliers/get_suppliers_search_list', 'SupplierController@getSuppliersSearch_list');
Route::post('suppliers/get_suppliers_search', 'SupplierController@getSuppliersSearch');
/**/
Route::resource('suppliers', 'SupplierController');
/*----------------------------------------------------------------------------------------------*/


/*-------------------------------------------clients-------------------------------------------*/
/**/
Route::post('clients/get_clients_search_list', 'ClientController@getClientsSearch_list');
Route::post('clients/get_clients_search', 'ClientController@getClientsSearch');
/**/
Route::resource('clients', 'ClientController');
/*----------------------------------------------------------------------------------------------*/

/*-------------------------------------------products-------------------------------------------*/
/**/
Route::post('products/get_products_search_list', 'ProductController@getProductsSearch_list');
Route::post('products/get_products_search_sell', 'ProductController@getProductsBySearch_sell');
Route::post('products/get_products_search_buy', 'ProductController@getProductsBySearch_buy');
/**/
Route::resource('products', 'ProductController');

/*----------------------------------------------------------------------------------------------*/
/*-------------------------------------------subcategories-------------------------------------------*/
/**/
Route::post('subcategories/getsubcategoriessearch', 'SubcategoryController@getSubcategoriesSearch');
/**/
Route::resource('subcategories', 'SubcategoryController');
/*----------------------------------------------------------------------------------------------*/


/*-------------------------------------------categories-------------------------------------------*/
/**/
Route::post('categories/getcategoriessearch', 'CategoryController@getCategoriesSearch');
/**/
Route::resource('categories', 'CategoryController');
/*----------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------*/

/*-------------------------------------------services-------------------------------------------*/
/**/
Route::post('services/get_services_search_list', 'ServiceController@getServicesSearch_list');
Route::post('services/get_services_search_sell', 'ServiceController@getServicesBySearch_sell');
/**/
Route::resource('services', 'ServiceController');

/*----------------------------------------------------------------------------------------------*/

/*-------------------------------------------service categories-------------------------------------------*/
/**/
Route::post('servicecategories/getcategoriessearch', 'ServiceCategoryController@getCategoriesSearch');
/**/
Route::resource('servicecategories', 'ServiceCategoryController');
/*----------------------------------------------------------------------------------------------*/


/*-------------------------------------------invoices-------------------------------------------*/
/**/
Route::post('invoices/get_invoices_search_list', 'InvoiceController@getInvoicesSearch_list');
/**/
Route::resource('invoices', 'InvoiceController');
/*----------------------------------------------------------------------------------------------*/

/*-------------------------------------------vouchers-------------------------------------------*/
/**/
Route::post('vouchers/get_vouchers_search_list', 'VoucherController@getVouchersSearch_list');
/**/
Route::resource('vouchers', 'VoucherController');
/*----------------------------------------------------------------------------------------------*/


Route::resource('invoice_items', 'invoiceItemController');

// Customize  ROLES API
Route::get('roles/{id}', 'RoleController@singleRole');
Route::get('roles/{role}/singleRoleWithUsers', 'RoleController@singleRoleWithUsers');

//Customize USERS API
Route::get('users/{id}/singleUser', 'UserController@singleUser');
Route::get('users/{id}/singleUserWithRole', 'UserController@singleUserWithRole');

//Customize CLIENTS API
Route::get('clients/{id}/singleClient', 'ClientController@singleClient');
Route::get('clients/{id}/Client/invoices', 'ClientController@singleClientWithInvoices');

//Customize CATEGORY API
Route::get('category/{id}/singleCategory', 'categoryController@singleCategory');
Route::get('category/{id}/singleCategory/subcategory', 'categoryController@singleCategoryWithSubcategory');
Route::get('category/{id}/singleCategory/subcategory/products', 'categoryController@singleCategoryWithSubcategoryWithProducts');

//Customize SUBCATEGORY API
Route::get('subcategory/{id}/singleSubcategory', 'subcategoryController@singleSubcategory');
Route::get('subcategory/{id}/singleSubcategory/products', 'subcategoryController@singleSubcategoryWithProducts');
Route::get('subcategory/{id}/singleSubcategory/category', 'subcategoryController@singleSubcategoryWithCategory');

//Customize PRODUCT API


Route::get('products/{perpage}/paginate', 'productController@index');


Route::get('product/{id}/singleProduct', 'productController@singleProduct');
Route::get('product/{id}/singleProduct/subcategory', 'productController@singleProductWithSubcategory');
Route::get('product/{id}/singleProduct/subcategory/category', 'productController@singleProductWithSubcategoryWithCategory');
Route::get('product/{id}/singleProduct/vendor', 'productController@singleProductWithVendor');


//Customize VENDOR API
Route::get('vendor/{id}/singleVendor', 'vendorController@singleVendor');
Route::get('vendor/{id}/singleVendor/products', 'vendorController@singleVendorwithProducts');

//CUSTOMIZE INVOICE API
Route::get('invoice/{id}/singleInvoice', 'invoiceController@singleInvoice');

//CUSTOMIZE INVOICE_ITEM API
Route::get('invoiceitem/{id}/singleInvoiceItem', 'invoiceItemController@singleInvoiceItem');
Route::get('invoiceitem/{id}/singleInvoiceItem/invoice', 'invoiceItemController@singleInvoiceItemWithInvoice');
Route::get('invoiceitem/{id}/singleInvoiceItem/product', 'invoiceItemController@singleInvoiceItemWithProducts');
























//Route::get('users/{user}/role', 'UserController@role');
//Route::get('category', 'categoryController@index');
//Route::get('category/{category}', 'categoryController@singlecategory');
//Route::get('category/{category}/subcategory', 'categoryController@singlecategoryWithSubcategory');
//Route::get('category/{category}/subcategory/product', 'categoryController@singlecategoryWithSubcategoryWithProduct');
//
//
//Route::get('subcategory', 'subcategoryController@index');
//Route::get('subcategory/{subcategory}', 'subcategoryController@singleSubcategory');
//Route::get('subcategory/{subcategory}/product', 'subcategoryController@singleSubcategoryWithProduct');
//Route::get('subcategory/{subcategory}/category', 'subcategoryController@singleSubcategoryWithCategory');
//
//
//Route::get('product', 'productController@index');
//Route::get('product/{product}', 'productController@singleProduct');
//Route::get('product/{product}/subcategory', 'productController@singleProductWithSubcategory');
//Route::get('product/{product}/subcategory/category', 'productController@singleProductWithSubcategoryWithCategory');
//




