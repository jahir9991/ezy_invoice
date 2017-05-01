/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.suppliers')
        .controller('SingleSupplierPageCtrl', SingleSupplierPageCtrl);


    /** @ngInject */
    function SingleSupplierPageCtrl($state, $scope, baConfig, colorHelper, $q, CONFIG, $http, $filter, editableOptions, editableThemes, statusModel, $uibModal, supplierModel, toastr, jamodal, ngDialog) {


        var vm = this;
        console.log($scope);
        vm.data = 10;
        if ($state.params.id !== "") {
            vm.validSupplier = true;
            ngDialog.close();
        } else {
            ngDialog.open({
                template: 'templateId',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: true,
                showClose: false

            });
        }


        vm.smartTablePageSize = 10;
        vm.pages = [2, 10, 15, 20, 25];
        vm.form = {};
        vm.displayed = [];
        vm.tableState = {}
        vm.callServer = callServer;
        vm.insertFormSubmit = insertFormSubmit;
        vm.removeSupplier = removeSupplier;
        vm.editSupplierName = editSupplierName;
        vm.statusUpdate = statusUpdate;
        vm.supplierDelete = supplierDelete;
        vm.singleSupplier = {};
        vm.viewSingleSupplier = viewSingleSupplier;
        vm.update = update;

        $http.get(CONFIG.url + '/api/suppliers/').then(function () {
        });
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


            console.log(tableState);
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
                    first_name: vm.supplierSearch.first_name || "",
                    last_name: vm.supplierSearch.last_name || "",
                    address: vm.supplierSearch.address || "",
                    email: vm.supplierSearch.email || "",
                    phone: vm.supplierSearch.phone || "",
                    status: vm.supplierSearch.status || "",
                },
                sort: {
                    key: sort.predicate || "id",
                    order: order
                }
            }

            supplierModel.getSuppliersSearch(d, function (result) {
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
                template: 'templateId',
                closeByDocument: false,
                closeByEscape: true,
                controller: ['$scope', function ($scope, otherService) {
                    $scope.value = row;
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

        function editSupplierName(data) {
            if (data !== 'awesome') {
                return "Username should be `awesome`ddddddddddddddddddddddddddddd" +
                    "" +
                    "" +
                    "";
            }


        }

        $scope.transparent = baConfig.theme.blur;
        var dashboardColors = baConfig.colors.dashboard;

        $scope.doughnutData = {
            labels: [
                'Total',
                'Paid',
                'Due'

            ],
            datasets: [
                {
                    data: [2000, 1500, 500],
                    backgroundColor: [
                        dashboardColors.white,
                        dashboardColors.blueStone,

                        dashboardColors.silverTree,
                        dashboardColors.gossip

                    ],
                    hoverBackgroundColor: [
                        colorHelper.shade(dashboardColors.white, 15),
                        colorHelper.shade(dashboardColors.blueStone, 15),
                        colorHelper.shade(dashboardColors.surfieGreen, 15),
                        colorHelper.shade(dashboardColors.silverTree, 15),
                        colorHelper.shade(dashboardColors.gossip, 15)
                    ]
                }]
        };

        var ctx = document.getElementById('chart-area').getContext('2d');
        window.myDoughnut = new Chart(ctx, {
            type: 'doughnut',
            data: $scope.doughnutData,
            options: {
                cutoutPercentage: 64,
                responsive: true,
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        });


    }
})();
