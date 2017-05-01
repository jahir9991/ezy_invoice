/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.profile')
        .controller('ProfilePageCtrl', ProfilePageCtrl);

    /** @ngInject */
    function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, profileModel,$http) {
        var vm = this;
        // vm.userInfo={};
        vm.userInfo=profileModel.get();
        // $http.get('http://localhost/api/userinfo').success( function (data) {
        //     vm.userInfo = data
        //
        // });

        vm.removePicture = function () {
            vm.userInfo.image = $filter('appImage')('theme/no-photo.png');
            vm.noPicture = true;
        };


        vm.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();

        };


        vm.showModal = function (item) {
            $uibModal.open({
                animation: false,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
        };


        $scope.getFile = function (file) {
            if (!file) {
                return
            }
            ;
            fileReader.readAsDataUrl(file, $scope)
                .then(function (result) {
                    vm.userInfo.image = result;
                    console.log("so");
                }, function (result) {
                    // vm.picture = result;
                    console.log("werror");
                });
        };
        vm.updateProfile = function () {
            console.log("dd");


        }


    }

})();
