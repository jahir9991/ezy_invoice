/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';


    angular.module('InvoiceAdmin.home')
        .factory('paymentStatusModel', paymentStatusModel);


    /** @ngInject */
    function paymentStatusModel(CONFIG, $resource) {
        return $resource(CONFIG.url + '/api/paymentstatuses/:id', {id: '@_id'});

    }

})();
