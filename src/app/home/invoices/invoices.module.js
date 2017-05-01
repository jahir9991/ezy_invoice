/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.invoices', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('invoices', {
                url: '/invoices',
                abstract: true,
                authenticate: true,
                mustLogout: false,
                title: 'Invoices',
                template: '<ui-view></ui-view>',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 0,
                }
            })


            .state('invoices.list', {
                url: '/list',
                title: 'Invoice List',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/invoices/invoices.html',
                controller: 'InvoicesPageCtrl',
                controllerAs: 'invoices',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 1,
                },
            })
            .state('invoices.payments', {
                url: '/payments',
                title: 'Payments',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/invoices/payments/payments.html',
                controller: 'PaymentsCtrl',
                controllerAs: 'payments',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 2,
                },
            });
        $urlRouterProvider.when('/invoices', '/invoices/list');
    }

})();
