/**
 * Created by jahir on 3/6/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.products')
        .controller('CategoriesCtrl', CategoriesCtrl);

    /** @ngInject */
    function CategoriesCtrl($q, $filter, editableOptions, editableThemes, statusModel, $uibModal, categoryModel, toastr, jamodal, ngDialog) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.form = {};
        vm.displayed = [];
        vm.tableState = {}
        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeCategory = removeCategory;
        vm.editCategoryName = editCategoryName;
        vm.statusUpdate = statusUpdate;
        vm.categoryDelete = categoryDelete;
        vm.update = update;

        vm.categoryDeleteObject = {};
        vm.categorySearch = {}

        function insertFormSubmit(insertData) {

            categoryModel.save(insertData, function (response) {
                vm.insertData = {};
                toastr.success(response.sms);
                jamodal.success('Success', response.sms);

                vm.displayed.push(angular.extend(response.category, {new: true}));
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
            console.log(tableState);
            vm.isLoading = true;
            vm.noData = false;
            var pagination = tableState.pagination;

            var sort = tableState.sort;


            console.log(vm.categorySearch);

            var order = sort.reverse ? "DESC" : "ASC"

            var d = {
                pagination: {
                    per_page: pagination.number || 10,
                    page: (pagination.start / pagination.number) + 1 || 1,
                },
                search: {
                    id: vm.categorySearch.id || "",
                    name: vm.categorySearch.name || "",
                    status: vm.categorySearch.status || "",
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            categoryModel.getCategoriesSearch(d, function (result) {
                console.log(result);
                vm.displayed = result.data;


                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });


        };

        function categoryDelete() {
            var id = vm.categoryDeleteObject.id;
            var index = vm.categoryDeleteObject.index;
            categoryModel.delete({id: id}, function (response) {
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

        function removeCategory(id, index) {
            vm.categoryDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this client ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.categoryDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (categoryModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.categoryDelete = vm.categoryDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };

        function statusUpdate(data) {
            alert(data);
            return "error";

        }

        function update(key, id, newData, oldData) {
            var d = $q.defer();
            if (newData !== oldData) {
                var data = {key: key, newData: newData}
                categoryModel.update({id: id, data: data}, function (response) {
                    toastr.success(response.sms);
                    d.resolve()

                }, function (error) {
                    toastr.error(error.data);

                    d.reject(error.data);
                });

            } else {
                d.reject("change the value ");
            }

            return d.promise;
        }

        function editCategoryName(data) {
            if (data !== 'awesome') {
                return "Username should be `awesome`ddddddddddddddddddddddddddddd" +
                    "" +
                    "" +
                    "";
            }


        }


    }
})();
