/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.estimates', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('estimates', {
                url: '/estimates',
                title: 'Estimates',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/estimates/estimates.html',
                controller: 'EstimatesPageCtrl',
                controllerAs: 'estimates',
                sidebarMeta: {
                    icon: 'ion-calculator',
                    order: 3,
                },
            });
    }

})();
