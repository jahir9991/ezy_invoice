/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.suppliers')
        .factory('supplierModel', supplierModel);

    /** @ngInject */
    function supplierModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/suppliers/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getSuppliersSearch_list: {
                    url: CONFIG.url + '/api/suppliers/get_suppliers_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                getSuppliersBySearch: {
                    url: CONFIG.url + '/api/suppliers/get_suppliers_search',
                    method: 'POST',
                    isArray: true
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/suppliers/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
