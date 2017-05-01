/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.clients')
        .factory('clientModel', clientModel);

    /** @ngInject */
    function clientModel(CONFIG, $resource) {

        return $resource(CONFIG.url + '/api/clients/:id?:per_page=:per_page&:page=:page', {
                id: '@id',
                per_page: '@per_page',
                page: '@page'
            },
            {
                getClientsSearch_list: {
                    url: CONFIG.url + '/api/clients/get_clients_search_list', //full URL + custom action
                    method: 'POST',
                    isArray: false
                },
                getClientsBySearch: {
                    url: CONFIG.url + '/api/clients/get_clients_search',
                    method: 'POST',
                    isArray: true
                },
                delete: {
                    method: 'DELETE'
                },
                save: {
                    url: CONFIG.url + '/api/clients/',
                    method: 'POST'
                },
                update: {method: 'PUT'}
            }
        )


    }
})();
