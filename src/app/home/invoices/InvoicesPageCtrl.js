/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.invoices')
        .controller('InvoicesPageCtrl', InvoicesPageCtrl);


    /** @ngInject */
    function InvoicesPageCtrl($q, paymentModel, paymentStatusModel, clientModel, productModel, invoiceModel, toastr, jamodal, ngDialog) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.pages = [5, 10, 15, 20, 25];

        vm.displayed = [];
        vm.tableState = {}
        vm.clientList = [];
        vm.productList = [];


        vm.insertForm = {};
        vm.insertForm.sub_total_price = 0.00;
        vm.insertForm.discount_price = 0.00;
        vm.insertForm.total_price = 0.00;

        vm.insertForm.items = [];

        vm.invoiceDeleteObject = {};
        vm.invoiceSearch = {}
        vm.tableState = {}
        vm.paymentRow = {}

        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeInvoice = removeInvoice;

        vm.invoiceDelete = invoiceDelete;
        vm.update = update;

        vm.itemAdd = itemAdd;
        vm.itemRemove = itemRemove;
        vm.itemSubTotalPrice = itemSubTotalPrice;
        vm.itemTotalPrice = itemTotalPrice;
        vm.changeCurrentItem = changeCurrentItem;
        vm.getClientsBySearch = getClientsBySearch;
        vm.getProductsBySearch_sell = getProductsBySearch_sell;
        vm.getPaymentStatus = getPaymentStatus;
        vm.dateSearchChanged = dateSearchChanged;
        vm.removeDateSearch = removeDateSearch;
        vm.refreshInvoiceList = refreshInvoiceList;
        vm.addPayment = addPayment;
        vm.viewDetails = viewDetails;


        /*____________________________________________________________________________________________________________________-*/
        vm.getPaymentStatus();
        vm.getClientsBySearch("", 10); //name, phone or id
        vm.getProductsBySearch_sell("", 10);

        /*____________________________________________________________________________________________________________________-*/

        function getPaymentStatus() {
            paymentStatusModel.query(function (data) {
                vm.paymentStatusList = data;
            }, function (error) {
                toastr.error("payment status list load error");
            });
        }

        function getClientsBySearch(searchTerm, per_page) {
            clientModel.getClientsBySearch({searchTerm: searchTerm, per_page: per_page}, function (result) {
                vm.clientList = result;
            }, function (error) {
                toastr.error("client list load error");
            });
        }

        function getProductsBySearch_sell(searchTerm, per_page) {
            productModel.getProductsBySearch_sell({
                    searchTerm: searchTerm, per_page: per_page
                }, function (data) {
                    vm.productList = data;
                }
            )

        }

        function dateSearchChanged(newValue) {
            vm.invoiceSearch.date = newValue._i
            vm.callServer(vm.tableState)

        }

        function refreshInvoiceList() {
            vm.tableState.pagination = {
                number: vm.smartTablePageSize,
                start: 0,
                totalItemCount: 0
            };
            vm.tableState.sort = {};

            vm.invoiceSearch = {};
            vm.callServer(vm.tableState)

        }

        function removeDateSearch() {
            if ((vm.invoiceSearch.date !== undefined ) && (vm.invoiceSearch.date !== '')) {
                vm.invoiceSearch.dd = '';
                vm.invoiceSearch.date = '';
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

        function changeCurrentItem(currentItem, index) {

            vm.insertForm.items[index].product_rate = currentItem.selling_price;
            vm.insertForm.items[index].product_id = currentItem.id;
            vm.insertForm.items[index].name = currentItem.name;

        }

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
                invoiceModel.save(vm.insertForm, function (response) {
                    vm.insertData = {};
                    toastr.success(response.sms);
                    jamodal.success('Success', response.sms);

                    vm.displayed.push(angular.extend(response.invoice, {new: true}));
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

        function addPayment(row, index) {

            vm.paymentRowIndex = index;
            ngDialog.open({
                templateUrl: 'app/home/invoices/payments/addPayment_modal.html',
                className: 'ngdialog-theme-default addPaymentModal',
                id: 'addPaymentModal',

                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                controller: ['$scope', function ($scope, otherService) {

                    $scope.invoice = row;
                    $scope.addPaymentForm = {
                        client_id: row.client_id,
                        invoice_id: row.id,
                        invoice_number: row.number
                    };

                    $scope.addPayment = function () {
                        paymentModel.save($scope.addPaymentForm, function (response) {
                            vm.displayed[vm.paymentRowIndex] = response.invoice;
                            ngDialog.close();

                        })


                    }
                    $scope.addPaymentFormSubmit = function (addPaymentForm) {
                        ngDialog.open({
                            template: '\
                                                  <p>Are you sure want to Add Payment?</p>\                       <div class="ngdialog-buttons">\
                                                   <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                                          <button type="button" class="ngdialog-button btn-danger" \
                                                          ng-click="vm.addPayment()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                                       </div>',
                            plain: true,
                            controller: function (invoiceModel) {
                                "ngInject";
                                var cvm = this;

                                cvm.addPayment = $scope.addPayment;

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


            console.log(vm.invoiceSearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.invoiceSearch.id || "",
                    number: vm.invoiceSearch.number || "",

                    date: vm.invoiceSearch.date || "",
                    client_id: vm.invoiceSearch.client_id || "",
                    total_price: vm.invoiceSearch.total_price || "",
                    paid_price: vm.invoiceSearch.paid_price || "",
                    due_price: vm.invoiceSearch.due_price || "",
                    payment_status_id: vm.invoiceSearch.paymentStatus || ""
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            invoiceModel.getInvoicesSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;
                vm.totalInvoices = result.total;
                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });
        };

        function invoiceDelete() {
            var id = vm.invoiceDeleteObject.id;
            var index = vm.invoiceDeleteObject.index;
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

        function removeInvoice(id, index) {
            vm.invoiceDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this invoice ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.invoiceDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (invoiceModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.invoiceDelete = vm.invoiceDelete;

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
