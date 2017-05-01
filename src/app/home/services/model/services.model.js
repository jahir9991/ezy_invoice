/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.services')
        .factory('serviceModel', serviceModel);

    /** @ngInject */
    function serviceModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/services/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getServicesSearch_list: {
                    url: CONFIG.url + '/api/services/get_services_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                getServicesBySearch_sell: {
                    url: CONFIG.url + '/api/services/get_services_search_sell', //full URL + custom action
                    method: 'POST',
                    isArray: true
                }, 
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/services/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
