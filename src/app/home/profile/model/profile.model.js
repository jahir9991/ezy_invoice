/**
 * Created by jahir9991 on 3/7/17.
 **/

(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.profile')
        .factory('profileModel', profileModel);

    /** @ngInject */
    function profileModel($resource) {
        return $resource('http://localhost/api/userinfo/:id');

    }
})();
