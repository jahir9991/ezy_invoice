/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.suppliers',[])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('suppliers', {
                url: '/suppliers',
                abstract: true,
                authenticate: true,
                mustLogout: false,
                title: 'Suppliers',
                template: '<ui-view></ui-view>',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 5,
                },
            }).state('suppliers.list', {
            url: '/list',
            title: 'Supplier List',
            authenticate: true,
            mustLogout: false,
            templateUrl: 'app/home/suppliers/suppliers.html',
            controller: 'SuppliersPageCtrl',
            controllerAs: 'suppliers',
            sidebarMeta: {
                icon: 'ion-person-stalker',
                order: 5,
            },
        })
            .state('suppliers.single', {
                url: '/single/:id',
                title: 'Single Supplier',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/suppliers/single/single_supplier.html',
                controller: 'SingleSupplierPageCtrl',
                controllerAs: 'singleSupplier',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 5,
                },
            });
        $urlRouterProvider.when('/suppliers', '/suppliers/list');
    }

})();
