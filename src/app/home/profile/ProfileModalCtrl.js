/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
  'use strict';

  angular.module('InvoiceAdmin.home.profile')
    .controller('ProfileModalCtrl', ProfileModalCtrl);

  /** @ngInject */
  function ProfileModalCtrl($scope, $uibModalInstance) {
    $scope.link = '';
    $scope.ok = function () {
      $uibModalInstance.close($scope.link);
    };
  }

})();
