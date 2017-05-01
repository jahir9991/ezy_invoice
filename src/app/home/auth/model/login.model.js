/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.auth')
        .factory('loginModel', loginModel);

    /** @ngInject */
    function loginModel(CONFIG, $localStorage, $resource, $http, $q) {
        return $resource(CONFIG.url + '/api/login', {email: '@email', password: '@password'}, {
            login: {method: 'POST', url: CONFIG.url + '/api/login'}
        });

    }
})();
