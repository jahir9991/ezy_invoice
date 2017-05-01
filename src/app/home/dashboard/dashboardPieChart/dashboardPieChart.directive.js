/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.dashboard')
      .directive('dashboardPieChart', dashboardPieChart);

  /** @ngInject */
  function dashboardPieChart() {
    return {
      restrict: 'E',
      controller: 'DashboardPieChartCtrl',
      templateUrl: 'app/home/dashboard/dashboardPieChart/dashboardPieChart.html'
    };
  }
})();
