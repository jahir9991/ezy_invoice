/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.reports', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('reports', {
          url: '/reports',
          title: 'Reports',
          templateUrl: 'app/home/reports/reports.html',
          controller: 'ReportsPageCtrl',
          controllerAs: 'reports',
            sidebarMeta: {
                       icon: 'ion-ios-pulse-strong',
                       order: 7,
                     },
        });
  }

})();
