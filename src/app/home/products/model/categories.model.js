/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home')
        .factory('categoryModel', categoryModel);

    /** @ngInject */
    function categoryModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/categories/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getCategoriesSearch: {
                    url: CONFIG.url + '/api/categories/getcategoriessearch', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                }, save: {
                url: CONFIG.url + '/api/categories/',
                method: 'POST'
            },
                update: {method: 'PUT'}
            }
        )


    }
})();
