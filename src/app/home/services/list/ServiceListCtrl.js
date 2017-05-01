/**
 * Created by jahir on 3/6/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.services')
        .controller('ServiceListCtrl', ServiceListCtrl);

    /** @ngInject */
    function ServiceListCtrl($q, statusModel, serviceModel, subcategoryModel, toastr, jamodal, ngDialog) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.form = {};
        vm.displayed = [];
        vm.tableState = {}
        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeProduct = removeProduct;
        vm.productDelete = productDelete;
        vm.subcategoryAfterSave = subcategoryAfterSave;
        vm.update = update;
        vm.productDeleteObject = {};
        vm.productSearch = {}

        function insertFormSubmit(insertData) {

            serviceModel.save(insertData, function (response) {
                vm.insertData = {};
                toastr.success(response.sms);
                jamodal.success('Success', response.sms);

                vm.displayed.push(angular.extend(response.product, {new: true}));
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
        });

        subcategoryModel.query(function (data) {
            vm.subcategoryList = data;

        });

        function callServer(tableState) {
            vm.isLoading = true;
            vm.noData = false;
            var pagination = tableState.pagination;
            var sort = tableState.sort;
            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.productSearch.id || "",
                    name: vm.productSearch.name || "",
                    brand: vm.productSearch.brand || "",
                    quantity: vm.productSearch.quantity || "",
                    buying_price: vm.productSearch.buying_price || "",
                    selling_price: vm.productSearch.selling_price || "",
                    status: vm.productSearch.status || "",
                    subcategory: vm.productSearch.subcategory || "",
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            serviceModel.getProductsSearch_list(d, function (result) {
                console.log(result);
                vm.displayed = result.data;

                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });


        };

        function productDelete() {
            var id = vm.productDeleteObject.id;
            var index = vm.productDeleteObject.index;
            serviceModel.delete({id: id}, function (response) {
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

        function removeProduct(id, index) {
            vm.productDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this product ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.productDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function () {
                    "ngInject";
                    var cvm = this;

                    cvm.productDelete = vm.productDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };
        function subcategoryAfterSave(row, data) {

            angular.forEach(vm.subcategoryList, function (value, key) {
                if (value.id === data) {
                    row.subcategory = value
                }
            });
        }


        function update(key, id, newData, oldData) {
            var d = $q.defer();
            if (newData !== oldData) {
                var data = {key: key, newData: newData}
                serviceModel.update({id: id, data: data}, function (response) {
                    toastr.success(response.sms);
                    d.resolve()

                }, function (error) {
                    toastr.error(error.data);

                    d.reject(error.data);
                });
            }
            else {
                d.reject('change the value');

            }
            return d.promise;
        }


    }
})();
