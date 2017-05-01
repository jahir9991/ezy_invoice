/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.services')
        .factory('serviceCategoryModel', serviceCategoryModel);

    /** @ngInject */
    function serviceCategoryModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/servicecategories/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getCategoriesSearch: {
                    url: CONFIG.url + '/api/servicecategories/getcategoriessearch', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                delete: {
                    method: 'DELETE'
                }, save: {
                url: CONFIG.url + '/api/servicecategories/',
                method: 'POST'
            },
                update: {method: 'PUT'}
            }
        )


    }
})();
