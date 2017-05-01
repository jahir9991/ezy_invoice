/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home', [

        'ui.router',
        'angular-loading-bar',
        'ngAnimate',
        'ngResource',

        'InvoiceAdmin.home.auth',
        'InvoiceAdmin.home.profile',
        'InvoiceAdmin.home.dashboard',
        'InvoiceAdmin.home.products',
        'InvoiceAdmin.home.clients',
        'InvoiceAdmin.home.invoices',
        'InvoiceAdmin.home.estimates',
        'InvoiceAdmin.home.suppliers',
        'InvoiceAdmin.home.jobcard',
        'InvoiceAdmin.home.employees',
        'InvoiceAdmin.home.vouchers',
         'InvoiceAdmin.home.services',
         // 'InvoiceAdmin.home.reports',

    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/dashboard');
    }

})();


angular.module('InvoiceAdmin.home')
    .run(function ($rootScope, cfpLoadingBar) {
        $rootScope.$on('$locationChangeSuccess', function () {
            cfpLoadingBar.start();
        });


        $rootScope.$on('$locationChangeSuccess', function () {
            cfpLoadingBar.complete();
        });
        // Do the same with $routeChangeError
    });
