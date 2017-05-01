/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.invoices')
        .factory('paymentModel', paymentModel);

    /** @ngInject */
    function paymentModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/payments/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getPaymentsSearch_list: {
                    url: CONFIG.url + '/api/payments/get_payments_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/payments/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
