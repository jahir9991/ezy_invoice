/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home')
        .controller('MainCtrl', MainCtrl);


    /** @ngInject */
    function MainCtrl(authModel, $rootScope, $localStorage, statusModel, clientModel, toastr, jamodal, $state) {

        var vm = this;
        vm.logedIn = $localStorage.token;
        vm.logOut = logOut;

        $rootScope.$on("tokenChanged", function () {
            vm.logedIn = true;

        });

        function logOut() {
            delete $localStorage.token;
            toastr.info("Sign Out", '!');
            $state.transitionTo("auth");
            vm.logedIn = false;

        };


    }
})();
