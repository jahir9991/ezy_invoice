/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.vouchers')
        .factory('voucherModel', voucherModel);

    /** @ngInject */
    function voucherModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/vouchers/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getVouchersSearch_list: {
                    url: CONFIG.url + '/api/vouchers/get_vouchers_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/vouchers/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
