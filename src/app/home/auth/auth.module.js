/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.auth', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'app/home/auth/auth.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                authenticate: false,
                mustLogout: true
            });


    }

})();
