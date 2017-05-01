/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.auth')
        .controller('AuthCtrl', AuthCtrl);

    /** @ngInject */
    function AuthCtrl(toastr, loginModel, registerModel, $localStorage, $state, $rootScope, jwtHelper) {

        var vm = this;
        vm.loginForm = {};
        vm.signupForm = {};
        vm.login = login;
        vm.signup = signup;


        function login(loginForm) {

            loginModel.login(loginForm, function (response) {
                $rootScope.$emit("tokenChanged", response.token);

                var tokenPayload = jwtHelper.decodeToken(response.token);

                $localStorage.token = response.token;
                toastr.success('Logged in successfully!');
                console.log(tokenPayload);

                $state.transitionTo('dashboard');


            }, function (error) {
                console.log(error.data);
                toastr.error("error", error.data);

            });


        }

        function signup(signupForm) {
            // console.log(signupForm);

            registerModel.save(signupForm, function (response) {
                $rootScope.$emit("tokenChanged", response.token);
                $localStorage.token = response.token;

                console.log(response);
                toastr.success("saved");
                $state.transitionTo('dashboard');
            }, function (error) {
                console.log(error);
                toastr.error("error");

            })
        }


    }
})();
