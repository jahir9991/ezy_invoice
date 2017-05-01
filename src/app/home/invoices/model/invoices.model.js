/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.invoices')
        .factory('invoiceModel', invoiceModel);

    /** @ngInject */
    function invoiceModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/invoices/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getInvoicesSearch_list: {
                    url: CONFIG.url + '/api/invoices/get_invoices_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/invoices/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
