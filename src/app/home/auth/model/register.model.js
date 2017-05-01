/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('InvoiceAdmin.home.auth')
        .factory('registerModel', registerModel);

    /** @ngInject */
    function registerModel(CONFIG, $resource) {
        return $resource(CONFIG.url + '/api/register/');


    }
})();
