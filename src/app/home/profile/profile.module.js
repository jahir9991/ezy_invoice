/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.profile', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home.profile', {
                url: '/profile',
                title: 'Profile',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/profile/profile.html',
                controller: 'ProfilePageCtrl',
                controllerAs: 'profile',
            });
    }

})();
