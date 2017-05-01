/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.products', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('products', {
                url: '/products',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'ProductsPageCtrl',
                title: 'Products',
                sidebarMeta: {
                    icon: 'ion-ios-cart',
                    order: 1,
                },
            }).state('products.list', {
            url: '/list',
            templateUrl: 'app/home/products/list/productList.html',
            title: 'List',
            authenticate: true,
            mustLogout: false,
            controller: 'ProductListCtrl',
            controllerAs: 'products',
            sidebarMeta: {
                order: 0,
            },
        }).state('products.categories', {
            url: '/categories',
            templateUrl: 'app/home/products/categories/categories.html',
            title: 'Categories',
            authenticate: true,
            mustLogout: false,
            controller: 'CategoriesCtrl',
            controllerAs: 'categories',
            sidebarMeta: {
                order: 1,
            },
        }).state('products.subcategories', {
            url: '/subcategories',
            templateUrl: 'app/home/products/subcategories/subcategories.html',
            title: 'Sub Categories',
            authenticate: true,
            mustLogout: false,
            controller: 'SubcategoriesCtrl',
            controllerAs: 'subcategories',
            sidebarMeta: {
                order: 2,
            },
        });
        $urlRouterProvider.when('/products', '/products/list');
    }

})();
