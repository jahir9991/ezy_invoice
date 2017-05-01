/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.reports')
        .factory('reportsModel', reportsModel);

    /** @ngInject */
    function reportsModel($resource) {
        return $resource('http://localhost/api/userinfo/:id');

    }
})();
