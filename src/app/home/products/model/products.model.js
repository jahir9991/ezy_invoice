/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home')
        .factory('productModel', productModel);

    /** @ngInject */
    function productModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/products/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getProductsSearch_list: {
                    url: CONFIG.url + '/api/products/get_products_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                getProductsBySearch_sell: {
                    url: CONFIG.url + '/api/products/get_products_search_sell', //full URL + custom action
                    method: 'POST',
                    isArray: true
                }, getProductsBySearch_buy: {
                url: CONFIG.url + '/api/products/get_products_search_buy', //full URL + custom action
                method: 'POST',
                isArray: true
            },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/products/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
