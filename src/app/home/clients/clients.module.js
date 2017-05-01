/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.clients',[])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('clients', {
                url: '/clients',
                abstract: true,
                authenticate: true,
                mustLogout: false,
                title: 'Clients',
                template: '<ui-view></ui-view>',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 5,
                },
            }).state('clients.list', {
            url: '/list',
            title: 'Client List',
            authenticate: true,
            mustLogout: false,
            templateUrl: 'app/home/clients/clients.html',
            controller: 'ClientsPageCtrl',
            controllerAs: 'clients',
            sidebarMeta: {
                icon: 'ion-person-stalker',
                order: 5,
            },
        })
            .state('clients.single', {
                url: '/single/:id',
                title: 'Single Client',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/clients/single/single_client.html',
                controller: 'SingleClientsPageCtrl',
                controllerAs: 'singleClient',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 5,
                },
            });
        $urlRouterProvider.when('/clients', '/clients/list');
    }

})();
