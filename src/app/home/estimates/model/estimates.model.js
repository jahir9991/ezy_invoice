/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home')
        .factory('estimateModel', estimateModel);

    /** @ngInject */
    function estimateModel($resource) {
        return $resource('http://localhost/api/userinfo/:id');

    }
})();
