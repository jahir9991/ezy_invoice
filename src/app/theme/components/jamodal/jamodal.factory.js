/**
 * @author v.lugovksy
 * created on 16.12.2015
 * @deprecated
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin')
        .factory('jamodal', jamodal);

    /** @ngInject */
    function jamodal($uibModal) {
        function open(page, title, message) {
            $uibModal.open({
                controller: function ($uibModalInstance, items) {
                    var vm = this;
                    vm.content = items;
                    vm.confirm = $uibModalInstance.close;
                    vm.cancel = $uibModalInstance.dismiss;
                },
                controllerAs: 'vm',
                animation: true,
                templateUrl: page,
                resolve: {
                    items: function () {
                        return {
                            title: title,
                            message: message
                        }
                    }
                }
            });
        }

        var pageUrl = {
            success: 'app/theme/components/jamodal/modalTemplates/successModal.html',
            error: 'app/theme/components/jamodal/modalTemplates/dangerModal.html',
            warning: 'app/theme/components/jamodal/modalTemplates/warningModal.html',
            basic: 'app/theme/components/jamodal/modalTemplates/basicModal.html',
        };

        function basic() {
            open(pageUrl.basic)
        }

        function success(title, message) {
            open(pageUrl.success, title, message)
        }

        function error(title, message) {
            open(pageUrl.error, title, message)
        }

        function warning() {
            open(pageUrl.warning)
        }


        return {
            basic: basic,
            success: success,
            error: error,
            warning: warning
        }
    }


})();
