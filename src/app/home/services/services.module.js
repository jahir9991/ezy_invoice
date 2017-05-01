/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.services', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('services', {
                url: '/services',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'ServicesPageCtrl',
                title: 'Services',
                sidebarMeta: {
                    icon: 'ion-ios-pulse-strong',
                    order: 7,
                },
            }).state('services.list', {
            url: '/list',
            templateUrl: 'app/home/services/list/serviceList.html',
            title: 'List',
            authenticate: true,
            mustLogout: false,
            controller: 'ServiceListCtrl',
            controllerAs: 'services',
            sidebarMeta: {
                order: 0,
            },
        }).state('services.categories', {
            url: '/categories',
            templateUrl: 'app/home/services/categories/categories.html',
            title: 'Categories',
            authenticate: true,
            mustLogout: false,
            controller: 'CategoriesCtrl',
            controllerAs: 'categories',
            sidebarMeta: {
                order: 1,
            },
        });
        $urlRouterProvider.when('/services', '/services/list');
    }

})();
