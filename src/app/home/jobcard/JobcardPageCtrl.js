/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.clients')
        .controller('JobcardPageCtrl', JobcardPageCtrl);


    /** @ngInject */
    function JobcardPageCtrl($q, statusModel, clientModel, toastr, jamodal, ngDialog) {

        var vm = this;
        vm.today =new Date();
        vm.number = Math.random().toString(36).substring(7);
        vm.checkInput = true;
        vm.checkChange = checkChange;
        vm.refresh = refresh;
        vm.print = print;

        function refresh() {
            if (vm.checkInput) {
                vm.number = Math.random().toString(36).substring(7);
            }

        }

        function checkChange() {
            if (vm.checkInput) {
                vm.number = Math.random().toString(36).substring(7);
            }

        }

        function print(divName) {

            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
            refresh();
        }
    }
})();
