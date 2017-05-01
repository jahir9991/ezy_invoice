/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.suppliers')
        .controller('SuppliersPageCtrl', SuppliersPageCtrl);


    /** @ngInject */
    function SuppliersPageCtrl($q, statusModel, supplierModel, toastr, jamodal, ngDialog) {
        ngDialog.close();
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.pages = [2, 10, 15, 20, 25];
        vm.form = {};
        vm.displayed = [];
        vm.tableState = {}
        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeSupplier = removeSupplier;

        vm.statusUpdate = statusUpdate;
        vm.supplierDelete = supplierDelete;
        vm.singleSupplier = {};
        vm.viewSingleSupplier = viewSingleSupplier;
        vm.update = update;


        vm.supplierDeleteObject = {};
        vm.supplierSearch = {}

        function insertFormSubmit(insertData) {

            supplierModel.save(insertData, function (response) {
                vm.insertData = {};
                toastr.success(response.sms);
                jamodal.success('Success', response.sms);

                vm.displayed.push(angular.extend(response.supplier, {new: true}));
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
        }


        statusModel.query(function (data) {
            vm.statusList = data;
            // vm.statusses = data;

        });

        function callServer(tableState) {


            vm.isLoading = true;
            vm.noData = false;
            var pagination = tableState.pagination;

            var sort = tableState.sort;


            console.log(vm.supplierSearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.supplierSearch.id || "",
                    name: vm.supplierSearch.name || "",
                    address: vm.supplierSearch.address || null,
                    email: vm.supplierSearch.email || null,
                    phone: vm.supplierSearch.phone || null,
                    status: vm.supplierSearch.status || "",
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            supplierModel.getSuppliersSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;


                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });


        };

        function viewSingleSupplier(row) {
            vm.value = 10;
            ngDialog.open({
                templateUrl: 'app/home/suppliers/suppliers_details_Modal.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: true,
                showClose: false,
                controller: ['$scope', function ($scope, otherService) {
                    $scope.singleSupplier = row;
                }]
            });
        }

        function supplierDelete() {
            var id = vm.supplierDeleteObject.id;
            var index = vm.supplierDeleteObject.index;
            supplierModel.delete({id: id}, function (response) {
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

        function removeSupplier(id, index) {
            vm.supplierDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this supplier ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.supplierDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (supplierModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.supplierDelete = vm.supplierDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };

        function statusUpdate(data) {
            alert(data);
            return "error";

        }

        function update(key, id, newData, index) {
            var d = $q.defer();
            var data = {key: key, newData: newData}

            supplierModel.update({id: id, data: data}, function (response) {
                toastr.success(response.sms);
                d.resolve()

            }, function (error) {
                toastr.error(error.data);

                d.reject(error.data);
            });

            return d.promise;
        }


    }
})();
