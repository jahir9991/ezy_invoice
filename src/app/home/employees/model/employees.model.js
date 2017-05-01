/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.employees')
        .factory('employeesModel', employees);

    /** @ngInject */
    function employees($resource) {
        return $resource('http://localhost/api/userinfo/:id');

    }
})();
