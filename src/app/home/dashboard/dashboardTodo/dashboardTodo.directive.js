/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.dashboard')
      .directive('dashboardTodo', dashboardTodo);

  /** @ngInject */
  function dashboardTodo() {
    return {
      restrict: 'EA',
      controller: 'DashboardTodoCtrl',
      templateUrl: 'app/home/dashboard/dashboardTodo/dashboardTodo.html'
    };
  }
})();
