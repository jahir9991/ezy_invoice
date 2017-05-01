/**
 * Created by jahir on 3/6/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.products')
        .controller('SubcategoriesCtrl', SubcategoriesCtrl);

    /** @ngInject */
    function SubcategoriesCtrl( $q, statusModel, categoryModel, subcategoryModel, toastr, jamodal, ngDialog) {
        var vm = this;
        vm.smartTablePageSize = 10;
        vm.form = {};
        vm.displayed = [];
        vm.tableState = {}
        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeSubcategory = removeSubcategory;
        vm.subcategoryDelete = subcategoryDelete;
        vm.categoryAfterSave = categoryAfterSave;
        vm.update = update;

        vm.subcategoryDeleteObject = {};
        vm.subcategorySearch = {}

        function insertFormSubmit(insertData) {

            subcategoryModel.save(insertData, function (response) {
                vm.insertData = {};
                toastr.success(response.sms);
                jamodal.success('Success', response.sms);

                vm.displayed.push(angular.extend(response.subcategory, {new: true}));
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
        categoryModel.query(function (data) {
            vm.categoryList = data;
            console.log(data);
        });

        function callServer(tableState) {
            console.log(tableState);
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
                    id: vm.subcategorySearch.id || "",
                    name: vm.subcategorySearch.name || "",
                    status: vm.subcategorySearch.status || "",
                    category: vm.subcategorySearch.category || "",
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            subcategoryModel.getSubcategoriesSearch(d, function (result) {
                console.log(result);
                vm.displayed = result.data;


                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update
                vm.isLoading = false;
                vm.noData = result.data.length ? false : true;

            });


        };

        function subcategoryDelete() {
            var id = vm.subcategoryDeleteObject.id;
            var index = vm.subcategoryDeleteObject.index;
            subcategoryModel.delete({id: id}, function (response) {
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

        function removeSubcategory(id, index) {
            vm.subcategoryDeleteObject = {
                id: id,
                index: index
            }
            ngDialog.open({
                template: '\
                            <p>Are you sure want to delete this client ?</p>\                       <div class="ngdialog-buttons">\
                             <button type="button" class="ngdialog-button btn-primary" ng-click="closeThisDialog()">No</button>\
                                    <button type="button" class="ngdialog-button btn-danger" \
                                    ng-click="vm.subcategoryDelete()"><i class="fa fa-exclamation-triangle"></i>Yes</button>\
                                                 </div>',
                plain: true,
                controller: function (subcategoryModel) {
                    "ngInject";
                    var cvm = this;

                    cvm.subcategoryDelete = vm.subcategoryDelete;

                }, controllerAs: 'vm',
                className: 'ngdialog-theme-default'
            });


        };

        function categoryAfterSave(row, data) {

            angular.forEach(vm.categoryList, function (value, key) {
                if (value.id === data) {
                    row.category = value
                }
            });
        }

        function update(key, id, newData, oldData) {

            var d = $q.defer();
            if (newData !== oldData) {
                var data = {key: key, newData: newData}

                subcategoryModel.update({id: id, data: data}, function (response) {
                    toastr.success(response.sms);
                    d.resolve()

                }, function (error) {
                    toastr.error(error.data);

                    d.reject(error.data);
                });
            } else {
                d.reject("change the value");
            }
            return d.promise;
        }


    }
})();
