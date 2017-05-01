/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.dashboard')
      .directive('dashboardMap', dashboardMap);

  /** @ngInject */
  function dashboardMap() {
    return {
      restrict: 'E',
      controller: 'DashboardMapCtrl',
      templateUrl: 'app/home/dashboard/dashboardMap/dashboardMap.html'
    };
  }
})();
