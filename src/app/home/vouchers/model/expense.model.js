/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.vouchers')
        .factory('expenseModel', expenseModel);

    /** @ngInject */
    function expenseModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/expenses/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getExpensesSearch_list: {
                    url: CONFIG.url + '/api/expenses/get_expenses_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/expenses/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
