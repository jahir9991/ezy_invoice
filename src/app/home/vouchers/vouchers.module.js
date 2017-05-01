/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.vouchers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('vouchers', {
                url: '/vouchers',
                abstract: true,
                authenticate: true,
                mustLogout: false,
                title: 'Vouchers',
                template: '<ui-view></ui-view>',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 5,
                }
            })


            .state('vouchers.list', {
                url: '/list',
                title: 'Voucher List',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/vouchers/vouchers.html',
                controller: 'VouchersPageCtrl',
                controllerAs: 'vouchers',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 0,
                },
            })
            .state('vouchers.expenses', {
                url: '/expenses',
                title: 'Expenses',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/vouchers/expenses/expenses.html',
                controller: 'ExpensesCtrl',
                controllerAs: 'expenses',
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 1,
                },
            });
        $urlRouterProvider.when('/vouchers', '/vouchers/list');
    }

})();
