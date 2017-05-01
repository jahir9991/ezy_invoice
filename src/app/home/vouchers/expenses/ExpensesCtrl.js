/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.vouchers')
        .controller('ExpensesCtrl', ExpensesCtrl);


    /** @ngInject */
    function ExpensesCtrl(expenseModel, toastr) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.pages = [5, 10, 15, 20, 25];

        vm.displayed = [];
        vm.tableState = {}

        vm.expenseDeleteObject = {};
        vm.expenseSearch = {}


        vm.callServer = callServer;

        vm.removeExpense = removeExpense;


        vm.dateSearchChanged = dateSearchChanged;
        vm.removeDateSearch = removeDateSearch;
        vm.refreshExpenseList = refreshExpenseList;


        /*____________________________________________________________________________________________________________________-*/


        /*____________________________________________________________________________________________________________________-*/


        function dateSearchChanged(newValue) {
            vm.expenseSearch.date = newValue._i
            vm.callServer(vm.tableState)

        }

        function refreshExpenseList() {
            vm.tableState.pagination = {
                number: vm.smartTablePageSize,
                start: 0,
                totalItemCount: 0
            };
            vm.tableState.sort = {};

            vm.expenseSearch = {};
            vm.callServer(vm.tableState)

        }

        function removeDateSearch() {
            if ((vm.expenseSearch.date !== undefined ) && (vm.expenseSearch.date !== '')) {
                vm.expenseSearch.dd = '';
                vm.expenseSearch.date = '';
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


            console.log(vm.expenseSearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.expenseSearch.id || "",
                    voucher_number: vm.expenseSearch.voucher_number || "",

                    date: vm.expenseSearch.date || "",
                    supplier_id: vm.expenseSearch.supplier_id || "",
                    paid_price: vm.expenseSearch.paid_price || ""
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            expenseModel.getExpensesSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;
                vm.totalExpenses = result.total;
                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });
        };

        function expenseDelete() {
            var id = vm.expenseDeleteObject.id;
            var index = vm.expenseDeleteObject.index;
            voucherModel.delete({id: id}, function (response) {
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

        function removeExpense(id, index) {
            vm.expenseDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this expense ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.expenseDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (voucherModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.expenseDelete = vm.expenseDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };

        function update(key, id, newData, oldData) {

            var d = $q.defer();
            if (newData !== oldData) {

                var data = {key: key, newData: newData}

                voucherModel.update({id: id, data: data}, function (response) {
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
                templateUrl: 'app/home/vouchers/voucher_detail_modal.html',
                className: 'ngdialog-theme-default voucherDetailModal',
                id: 'voucherDetailModal',

                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                controller: ['$scope', function ($scope) {

                    $scope.voucher = row;
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
