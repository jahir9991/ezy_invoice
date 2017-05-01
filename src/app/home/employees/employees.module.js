/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.employees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('employees', {
                url: '/employees',
                title: 'Employees',
                authenticate: true,
                mustLogout: false,
                templateUrl: 'app/home/employees/employees.html',
                controller: 'EmployeesPageCtrl',
                controllerAs: 'employees',
                sidebarMeta: {
                    icon: 'ion-ios-people-outline',
                    order: 6,
                },
            });
    }

})();
