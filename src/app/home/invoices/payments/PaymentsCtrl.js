/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.invoices')
        .controller('PaymentsCtrl', PaymentsCtrl);


    /** @ngInject */
    function PaymentsCtrl(paymentModel, toastr) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.pages = [5, 10, 15, 20, 25];

        vm.displayed = [];
        vm.tableState = {}

        vm.paymentDeleteObject = {};
        vm.paymentSearch = {}


        vm.callServer = callServer;

        vm.removePayment = removePayment;


        vm.dateSearchChanged = dateSearchChanged;
        vm.removeDateSearch = removeDateSearch;
        vm.refreshPaymentList = refreshPaymentList;


        /*____________________________________________________________________________________________________________________-*/


        /*____________________________________________________________________________________________________________________-*/


        function dateSearchChanged(newValue) {
            vm.paymentSearch.date = newValue._i
            vm.callServer(vm.tableState)

        }

        function refreshPaymentList() {
            vm.tableState.pagination = {
                number: vm.smartTablePageSize,
                start: 0,
                totalItemCount: 0
            };
            vm.tableState.sort = {};

            vm.paymentSearch = {};
            vm.callServer(vm.tableState)

        }

        function removeDateSearch() {
            if ((vm.paymentSearch.date !== undefined ) && (vm.paymentSearch.date !== '')) {
                vm.paymentSearch.dd = '';
                vm.paymentSearch.date = '';
                vm.callServer(vm.tableState);
            }

        }


        function callServer(tableState) {
            vm.tableState = tableState;
            console.log(tableState)

            vm.isLoading = true;
            vm.noData = false;
            var pagination = tableState.pagination;

            var sort = tableState.sort;


            console.log(vm.paymentSearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.paymentSearch.id || "",
                    invoice_number: vm.paymentSearch.invoice_number || "",

                    date: vm.paymentSearch.date || "",
                    client_id: vm.paymentSearch.client_id || "",
                    paid_price: vm.paymentSearch.paid_price || ""
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            paymentModel.getPaymentsSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;
                vm.totalPayments = result.total;
                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });
        };

        function paymentDelete() {
            var id = vm.paymentDeleteObject.id;
            var index = vm.paymentDeleteObject.index;
            invoiceModel.delete({id: id}, function (response) {
                ngDialog.close();
                jamodal.success('Success', response.sms);

                toastr.success(response.sms);
                vm.displayed.splice(index, 1);
            }, function (error) {
                ngDialog.close();
                jamodal.error('Error', error.data);
                toastr.error(error.data);

            })


        }

        function removePayment(id, index) {
            vm.paymentDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this payment ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.paymentDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (invoiceModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.paymentDelete = vm.paymentDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };

        function update(key, id, newData, oldData) {

            var d = $q.defer();
            if (newData !== oldData) {

                var data = {key: key, newData: newData}

                invoiceModel.update({id: id, data: data}, function (response) {
                    toastr.success(response.sms);
                    d.resolve()

                }, function (error) {
                    toastr.error(error.data);

                    d.reject(error.data);
                });

            }
            else {
                d.reject("change the value ");
            }

            return d.promise;
        }

        function viewDetails(row) {
            vm.currentInvoice = row;
            ngDialog.open({
                templateUrl: 'app/home/invoices/invoice_detail_modal.html',
                className: 'ngdialog-theme-default invoiceDetailModal',
                id: 'invoiceDetailModal',

                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                controller: ['$scope', function ($scope) {

                    $scope.invoice = row;
                    $scope.print = function (divName) {
                        var printContents = document.getElementById(divName).innerHTML;
                        var popupWin = window.open('', '_blank');
                        popupWin.document.open();
                        popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '</body></html>');
                        popupWin.document.close();


                    };

                }]
            });


        }

    }
})
();
