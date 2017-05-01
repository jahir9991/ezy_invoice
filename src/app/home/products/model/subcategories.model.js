/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home')
        .factory('subcategoryModel', subcategoryModel);

    /** @ngInject */
    function subcategoryModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/subcategories/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getSubcategoriesSearch: {
                    url: CONFIG.url + '/api/subcategories/getsubcategoriessearch', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/subcategories/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
