/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.dashboard')
      .directive('dashboardCalendar', dashboardCalendar);

  /** @ngInject */
  function dashboardCalendar() {
    return {
      restrict: 'E',
      controller: 'DashboardCalendarCtrl',
      templateUrl: 'app/home/dashboard/dashboardCalendar/dashboardCalendar.html'
    };
  }
})();
