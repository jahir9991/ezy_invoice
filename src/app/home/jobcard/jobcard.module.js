/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.jobcard', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('jobcard', {
                url: '/jobcard',
                templateUrl: 'app/home/jobcard/jobcard.html',
                title: 'Job Card',
                authenticate: true,
                mustLogout: false,
                controller: 'JobcardPageCtrl',
                controllerAs: 'jobcard',
                sidebarMeta: {
                    order: 8,
                },
            });
     
    }

})();
