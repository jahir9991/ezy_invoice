/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.vouchers')
        .controller('VouchersPageCtrl', VouchersPageCtrl);


    /** @ngInject */
    function VouchersPageCtrl($q, expenseModel, paymentStatusModel, supplierModel, productModel, voucherModel, toastr, jamodal, ngDialog) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.pages = [5, 10, 15, 20, 25];

        vm.displayed = [];
        vm.tableState = {}
        vm.supplierList = [];
        vm.productList = [];


        vm.insertForm = {};
        vm.insertForm.sub_total_price = 0.00;
        vm.insertForm.discount_price = 0.00;
        vm.insertForm.total_price = 0.00;

        vm.insertForm.items = [];

        vm.voucherDeleteObject = {};
        vm.voucherSearch = {}
        vm.tableState = {}
        vm.expenseRow = {}

        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeVoucher = removeVoucher;

        vm.voucherDelete = voucherDelete;
        vm.update = update;

        vm.itemAdd = itemAdd;
        vm.itemRemove = itemRemove;
        vm.itemSubTotalPrice = itemSubTotalPrice;
        vm.itemTotalPrice = itemTotalPrice;
        // vm.changeCurrentItem = changeCurrentItem;
        vm.getSuppliersBySearch = getSuppliersBySearch;
        vm.getProductsBySearch_buy = getProductsBySearch_buy;
        vm.getPaymentStatus = getPaymentStatus;
        vm.dateSearchChanged = dateSearchChanged;
        vm.removeDateSearch = removeDateSearch;
        vm.refreshVoucherList = refreshVoucherList;
        vm.addExpense = addExpense;
        vm.viewDetails = viewDetails;


        /*____________________________________________________________________________________________________________________-*/
        vm.getPaymentStatus();
        vm.getSuppliersBySearch("", 10); //name, phone or id
        vm.getProductsBySearch_buy("", 10);

        /*____________________________________________________________________________________________________________________-*/

        function getPaymentStatus() {
            paymentStatusModel.query(function (data) {
                vm.paymentStatusList = data;
            }, function (error) {
                toastr.error("payment status list load error");
            });
        }

        function getSuppliersBySearch(searchTerm, per_page) {
            supplierModel.getSuppliersBySearch({searchTerm: searchTerm, per_page: per_page}, function (result) {
                vm.supplierList = result;
            }, function (error) {
                toastr.error("supplier list load error");
            });
        }

        function getProductsBySearch_buy(searchTerm, per_page) {
            productModel.getProductsBySearch_buy({
                    searchTerm: searchTerm, per_page: per_page
                }, function (data) {
                    vm.productList = data;
                }
            )

        }

        function dateSearchChanged(newValue) {
            vm.voucherSearch.date = newValue._i
            vm.callServer(vm.tableState)

        }

        function refreshVoucherList() {
            vm.tableState.pagination = {
                number: vm.smartTablePageSize,
                start: 0,
                totalItemCount: 0
            };
            vm.tableState.sort = {};

            vm.voucherSearch = {};
            vm.callServer(vm.tableState)

        }

        function removeDateSearch() {
            if ((vm.voucherSearch.date !== undefined ) && (vm.voucherSearch.date !== '')) {
                vm.voucherSearch.dd = '';
                vm.voucherSearch.date = '';
                vm.callServer(vm.tableState);
            }

        }

        function itemAdd() {

            if (vm.insertForm.items.length) {

                if (!vm.insertForm.items[vm.insertForm.items.length - 1].product_id) {
                    toastr.warning('Select previous Product Data')
                    return;
                } else {
                    var subTotalPrice = [];
                    angular.forEach(vm.insertForm.items, function (item) {
                        subTotalPrice += item.product_quantity * item.product_rate;
                    })
                    vm.productList = [];
                }
            }
            vm.insertForm.items.push({
                product_name: '',
                product_id: '',
                product_quantity: 1,
                product_rate: 0
            });
        }

        function itemRemove(index) {
            vm.insertForm.items.splice(index, 1);
        }

        // function changeCurrentItem(currentItem, index) {
        //
        //     vm.insertForm.items[index].product_rate = currentItem.selling_price;
        //     vm.insertForm.items[index].product_id = currentItem.id;
        //     vm.insertForm.items[index].name = currentItem.name;
        //
        // }

        function itemSubTotalPrice() {
            var subTotalPrice = 0;
            angular.forEach(vm.insertForm.items, function (item) {
                subTotalPrice += item.product_quantity * item.product_rate;
            })
            vm.insertForm.sub_total_price = subTotalPrice;
            return subTotalPrice;
        }

        function itemTotalPrice() {
            vm.insertForm.total_price = vm.insertForm.sub_total_price - vm.insertForm.discount_price;
            return vm.insertForm.total_price;

        }

        function insertFormSubmit(formDataValid) {
            console.log(formDataValid);
            console.log(vm.insertForm);
            if (formDataValid && vm.insertForm.sub_total_price > 0) {
                voucherModel.save(vm.insertForm, function (response) {
                    vm.insertData = {};
                    toastr.success(response.sms);
                    jamodal.success('Success', response.sms);

                    vm.displayed.push(angular.extend(response.voucher, {new: true}));
                    vm.noData = false;
                }, function (error) {
                    var values = error.data.errors;
                    var log = "";
                    angular.forEach(values, function (value, key) {
                        log = log + value + '<br/>';
                    });
                    jamodal.error('Error', log);

                    toastr.error("something went wrong");
                })

            } else {
                toastr.error("fill all required field");
            }


        }

        function addExpense(row, index) {

            vm.expenseRowIndex = index;
            ngDialog.open({
                templateUrl: 'app/home/vouchers/expenses/addExpense_modal.html',
                className: 'ngdialog-theme-default addExpenseModal',
                id: 'addExpenseModal',

                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                controller: ['$scope', function ($scope, otherService) {

                    $scope.voucher = row;
                    $scope.addExpenseForm = {
                        supplier_id: row.supplier_id,
                        voucher_id: row.id,
                        voucher_number: row.number
                    };

                    $scope.addExpense = function () {
                        expenseModel.save($scope.addExpenseForm, function (response) {
                            vm.displayed[vm.expenseRowIndex] = response.voucher;
                            ngDialog.close();

                        })


                    }
                    $scope.addExpenseFormSubmit = function (addExpenseForm) {
                        ngDialog.open({
                            template: '\
                                                  <p>Are you sure want to Add Expense?</p>\                       <div class="ngdialog-buttons">\
                                                   <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                                          <button type="button" class="ngdialog-button btn-danger" \
                                                          ng-click="vm.addExpense()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                                       </div>',
                            plain: true,
                            controller: function (voucherModel) {
                                "ngInject";
                                var cvm = this;

                                cvm.addExpense = $scope.addExpense;

                            }, controllerAs: 'vm',
                            className: 'ngdialog-theme-default'
                        });


                    };
                }]
            });
        }

        function callServer(tableState) {
            vm.tableState = tableState;
            console.log(tableState)

            vm.isLoading = true;
            vm.noData = false;
            var pagination = tableState.pagination;

            var sort = tableState.sort;


            console.log(vm.voucherSearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.voucherSearch.id || "",
                    number: vm.voucherSearch.number || "",

                    date: vm.voucherSearch.date || "",
                    supplier_id: vm.voucherSearch.supplier_id || "",
                    total_price: vm.voucherSearch.total_price || "",
                    paid_price: vm.voucherSearch.paid_price || "",
                    due_price: vm.voucherSearch.due_price || "",
                    payment_status_id: vm.voucherSearch.paymentStatus || ""
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            voucherModel.getVouchersSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;
                vm.totalVouchers = result.total;
                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });
        };

        function voucherDelete() {
            var id = vm.voucherDeleteObject.id;
            var index = vm.voucherDeleteObject.index;
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

        function removeVoucher(id, index) {
            vm.voucherDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this voucher ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.voucherDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (voucherModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.voucherDelete = vm.voucherDelete;

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
            vm.currentVoucher = row;
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
