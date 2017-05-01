/**
 * @author jahir9991
 * created on 16.12.2015
 */
(function () {
    'use strict';


    angular.module('InvoiceAdmin.home')
        .factory('statusModel', statusModel);


    /** @ngInject */
    function statusModel(CONFIG, $resource) {
        return $resource(CONFIG.url + '/api/statuses/:id', { id: '@_id' });

    }

})();
